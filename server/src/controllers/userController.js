import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import BookModel from "../models/bookModel.js";
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
async function GetAndValidateRequestingUser(req) {
    const {
        id, password,
    } = req.body;
    const requester = await UserModel.findOne({ id }).exec();
    if (bcrypt.compareSync(password, requester.password)) return requester;
    return undefined;
}
export async function GetUserOrFail(req, res) {
    const requester = await GetAndValidateRequestingUser(req);
    if (requester) {
        const user = await UserModel.findOne(req.body.filter).exec();
        // Only allow normal users to seach themselves.
        if (user && (user.id === requester.id || requester.role === "admin")) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ Error: "NotFound" });
        }
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function GetAllUsersOrFail(req, res) {
    const requester = await GetAndValidateRequestingUser(req);
    if (requester.role === "admin") {
        const allUsers = await UserModel.find().exec();
        if (allUsers) {
            res.status(200).json(allUsers);
        } else {
            res.status(400).json({ Error: "NotFound" });
        }
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function DeleteUserOrFail(req, res) {
    const requester = await GetAndValidateRequestingUser(req);
    if (requester && !requester.borrowed.length) {
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
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function ModifyUserOrFail(req, res) {
    const requester = await GetAndValidateRequestingUser(req);
    const password = req.body;
    const { id } = req.body.replacementData;
    const account = (id) ? await UserModel.findOne(id).exec() : requester;
    if (account && (bcrypt.compareSync(password, account.password) ||
                    requester.role === "admin")) {
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
// Maybe this should be part of bookController...
export async function ReserveBookForUserOrFail(req, res) {
    const user = await GetAndValidateRequestingUser(req);
    if (user) {
        const { isbn } = req.body;
        const copy = Number(req.body.copy);
        const book = await GetBookByIsbn(isbn);
        if (book) {
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
    } else {
        res.status(400).json({ Error: "UserNotFound" });
    }
}

export const userReturnBook = async (req, res) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const dailyFee = 1.5;
    const thisDay = new Date();

    const account = await UserModel.findOne({ id: req.body.id });

    if (account) {
        const isPassMatch = bcrypt.compareSync(req.body.password, account.password);

        if (isPassMatch) {
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
        } else {
            res.status(404).end("invalid password");
        }
    } else {
        res.status(404).end();
    }
};
export function GetUsersCurrentlyBorrowedBooksOrFail(req, res) {
    const requester = await GetAndValidateRequestingUser(req);
    if (requester) {
        const user = await UserModel.findOne(req.body.filter).exec();
        if (user && (user.id === requester.id || requester.role === "admin")) {
            res.status(200).json(user.borrowed);
        } else {
            res.status(400).json({ Error: "NotFound" });
        }
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
