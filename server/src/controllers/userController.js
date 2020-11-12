import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import { GetBookByID as GetBookByIsbn } from "./bookController.js";

export const newUser = async (req, res) => {
    const {
        name, email, role,
    } = req.body;

    const user = {
        name,
        email,
        role,
    };

    user.password = bcrypt.hashSync(req.body.password, 10);
    user.registration_date = new Date();
    user.fees = 0;
    user.borrowed = [];
    user.borrowedHistory = [];

    const userData = new UserModel(user);
    const field = ["_id"];
    user.id = userData[field].toString();
    userData.id = user.id;

    await userData.save();
    if (userData) {
        res.status(200).json(user);
    } else {
        res.status(404).end();
    }
};

export async function GetUserOrFail(req, res) {
    const user = await UserModel.findOne(req.body.filter).exec();
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function GetAllUsersOrFail(req, res) {
    const allUsers = await UserModel.find().exec();
    if (allUsers) {
        res.status(200).json(allUsers);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function DeleteUserOrFail(req, res) {
    const {
        id,
    } = req.body;
    const filter = {
        id,
    };
    const user = await UserModel.findOneAndRemove(
        filter,
        { useFindAndModify: false },
    );
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function ModifyUserOrFail(req, res) {
    const {
        id,
        password,
    } = req.body;
    const filter = { id, password };
    const account = await UserModel.findOne(filter).exec();
    if (account) {
        const rd = req.body.replacementData;

        const name = rd.name ? rd.name : account.name;
        const password = rd.password ? rd.password : account.password;
        const email = rd.email ? rd.email : account.email;

        const updatedAccount = await UserModel.findOneAndUpdate(
            filter,
            {
                ...account, name, password, email,
            },
            { useFindAndModify: false, new: true },
        ).exec();
        res.status(200).json(updatedAccount);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}

export const userBorrowBook = async (req, res) => {
    const weeks = 12096e5; // 2 week loan in ms
    const account = await UserModel.findOne({ id: req.body.id });

    if (account) {
        const isPassMatch = bcrypt.compareSync(req.body.password, account.password);

        if (isPassMatch) {
            const bookIsbn = req.body.isbn;
            const book = await GetBookByIsbn(bookIsbn);
            const coopyId = parseInt(req.body.copy, 10);
            const bookCopies = book.copies;
            const borrowDate = new Date();
            const returnDate = new Date(Date.now() + weeks);
            let bookAvailable = false;

            const updatedCopies = bookCopies.map((element) => {
                if (element.id === coopyId && element.status === "in_library" &&
                (element.reserveList.length === 0 || element.reserveList[0] === req.body.id)) {
                    const copiesMap = element;
                    if (copiesMap.reserveList[0] === req.body.id) {
                        copiesMap.reserveList =
                        copiesMap.reserveList.slice(1, copiesMap.length);
                    }
                    bookAvailable = true;
                    copiesMap.status = "borrowed";
                    copiesMap.borrower = req.body.id;
                    copiesMap.due = returnDate;
                    return copiesMap;
                }
                return element;
            });

            if (bookAvailable) {
                book.copies = updatedCopies;
                const borrowed = {
                    isbn: bookIsbn,
                    copy: coopyId,
                    borrow_date: borrowDate,
                };

                const borrowHistory = {
                    isbn: bookIsbn,
                    borrow_date: borrowDate,
                    return_date: returnDate,
                };

                account.borrowed = [...account.borrowed, borrowed];
                account.borrowHistory = [...account.borrowHistory, borrowHistory];

                await book.save();
                await account.save();

                res.status(200).json(borrowHistory);
            } else {
                res.status(404).end("book not available");
            }
        } else {
            res.status(404).end("invalid password");
        }
    } else {
        res.status(404).end();
    }
};
