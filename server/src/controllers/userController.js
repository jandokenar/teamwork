import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import BookModel from "../models/bookModel.js";
import { GetBookByID as GetBookByIsbn } from "./bookController.js";
import { CreateTokens } from "../authentication.js";
import { borrowTime, oneDay } from "../constants.js";
// @NOTE
// Authentication middleware adds user to request. (req.body.user)
// If authentication fails, middleware return early and the specified endpoint is not reached.
// So the passed in user is always valid. BUT middleware doesn't check user role.

/*
//Deprecated user login
//AuthenticateLocal middleware is used for this
export const GetAndValidateRequestingUser = async (req) => {
    const {
        id, password,
    } = req.body;
    const requester = await UserModel.findOne({ id }).exec();
    if (bcrypt.compareSync(password, requester.password)) return requester;
    return undefined;
}
*/

export const Login = async (req, res) => {
    const { userID } = req.body;
    const tokens = CreateTokens(userID);
    res.cookie("refreshToken", tokens.refreshToken)
        .status(200)
        .json({ token: tokens.token });
};
export const Logout = async (req, res) => {
    res.clearCookie("refreshToken")
        .status(200)
        .json({ token: null });
};
export const RenewLogin = async (req, res) => {
    const tokens = CreateTokens(req.body.decoded.userID);
    res.status(200).json({ token: tokens.token });
};
export const CreateNewUser = async (req, res) => {
    const {
        name, email, role,
    } = req.body;

    const user = {
        name,
        email,
        role,
    };
    const userDefined = await UserModel.findOne({ email });
    if (!userDefined) {
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
            return;
        }
    }
    res.status(404).end();
};
export const GetUserOrFail = async (req, res) => {
    const requester = req.body.user;

    const user = (req.body.filter) ? await UserModel.findOne(req.body.filter).exec() :
        requester;
    // Only allow normal users to seach themselves.
    if (user && (user.id === requester.id || requester.role === "admin")) {
        res.status(200).json(user);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
};
export const GetAllUsersOrFail = async (req, res) => {
    const allUsers = await UserModel.find().exec();
    if (allUsers) {
        res.status(200).json(allUsers);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
};
export const DeleteUserOrFail = async (req, res) => {
    const {
        id,
    } = req.body;

    const user = await UserModel.findOneAndDelete(
        { id },
        { useFindAndModify: false },
    );

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
};
export const ModifyUserOrFail = async (req, res) => {
    const requester = req.body.user;
    const { id } = req.body.replacementData;
    const account = (id && id !== requester.id) ?
        await UserModel.findOne(id).exec() :
        requester;
    if (account === requester ||
        requester.role === "admin") {
        const rd = req.body.replacementData;
        if (rd.password !== undefined) {
            rd.password = bcrypt.hashSync(rd.password, 10);
        }

        const updatedAccount = await UserModel.findOneAndUpdate(
            { id: account.id },
            rd,
            { useFindAndModify: false, new: true },
        ).exec();
        res.status(200).json(updatedAccount);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
};
export const UserBorrowBook = async (req, res) => {
    const account = req.body.user;

    const bookIsbn = req.body.isbn;
    const book = await GetBookByIsbn(bookIsbn);
    const coopyId = parseInt(req.body.copy, 10);
    const bookCopies = book.copies;
    const borrowDate = new Date();
    const returnDate = new Date(Date.now() + borrowTime);
    let bookAvailable = false;

    const updatedCopies = bookCopies.map((element) => {
        if (element.id === coopyId && element.status === "in_library" &&
            (element.reserveList.length === 0 ||
            element.reserveList[0].reserveId === req.body.id)) {
            const copiesMap = element;
            if (copiesMap.reserveList.length > 0) {
                if (copiesMap.reserveList[0].reserveId === req.body.id) {
                    copiesMap.reserveList =
                    copiesMap.reserveList.slice(1, copiesMap.length);
                }
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
};
export const ReserveBookForUserOrFail = async (req, res) => {
    const { user } = req.body;

    const { isbn } = req.body;
    const book = await GetBookByIsbn(isbn);
    if (book) {
        const copy = Number(req.body.copy);
        const bookCopy = book.copies.find((it) => it.id === copy);
        if (bookCopy) {
            if (!bookCopy.reserveList.find((it) => it.reserveId === user.id)) {
                bookCopy.reserveList = bookCopy.reserveList.concat(
                    { reserveId: user.id },
                );

                await BookModel.findOneAndUpdate(
                    { isbn },
                    book,
                    { useFindAndModify: false, new: true },
                ).exec();
                res.status(200).json(book);
            } else {
                res.status(400).json({ Error: "AlreadyOnReserveList" });
            }
        } else {
            res.status(400).json({ Error: "CopyNotFound" });
        }
    } else {
        res.status(400).json({ Error: "BookNotFound" });
    }
};

export const UserReturnBook = async (req, res) => {
    const dailyFee = 1.5;
    const thisDay = new Date();

    const account = req.body.user;

    const bookIsbn = req.body.isbn;
    const book = await GetBookByIsbn(bookIsbn);
    const coopyId = parseInt(req.body.copy, 10);
    const bookCopies = book.copies;

    let foundLoan = false;

    const updatedCopies = bookCopies.map((element) => {
        if (element.id === coopyId && element.status === "borrowed" &&
            element.borrower === req.body.id) {
            const copiesMap = element;
            if (copiesMap.due < thisDay) {
                const diffDays = Math.round(Math.abs((copiesMap.due - thisDay) / oneDay));
                account.fees += diffDays * dailyFee;
                console.log(account.fees);
            }
            copiesMap.status = "in_library";
            copiesMap.borrower = "";
            copiesMap.due = "";
            foundLoan = true;
            return copiesMap;
        }
        return element;
    });

    if (foundLoan) {
        book.copies = updatedCopies;
        const updatedBorrow = account.borrowed.filter(
            (element) => (element.copy !== coopyId && element.isbn !== bookIsbn),
        );
        account.borrowed = updatedBorrow;

        await book.save();
        await account.save();
        res.status(200).json(`book ${bookIsbn} returned`);
    } else {
        res.status(404).end("loan not found");
    }
};
export const GetUsersCurrentlyBorrowedBooksOrFail = async (req, res) => {
    const requester = req.body.user;
    const user = await UserModel.findOne(req.body.filter).exec();
    if (user && (user.id === requester.id || requester.role === "admin")) {
        res.status(200).json(user.borrowed);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
};
