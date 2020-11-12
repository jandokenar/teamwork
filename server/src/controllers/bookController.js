import bookModel from "../models/bookModel.js";

export const addBook = async (req, res) => {
    const {
        isbn, title, author, pages, description,
    } = req.body;

    const findBook = await bookModel.findOne({ isbn }).exec();

    if (findBook) {
        const newCopy = {
            id: findBook.copies[findBook.copies.length - 1].id + 1,
            status: "in_library",
        };
        const updatedCopies = [...findBook.copies, newCopy];
        const updatedBook = await bookModel.updateOne(
            { title },
            { copies: updatedCopies },
            { useFindAndModify: false, new: true },
        ).exec();
        res.status(200).json(updatedBook);
    } else {
        const book = {
            isbn,
            title,
            author,
            published: new Date(),
            pages,
            description,
            copies: [
                {
                    id: 1,
                    status: "in_library",
                },
            ],

        };

        const newBook = await bookModel(book);

        newBook.save();
        res.status(201).json(newBook);
    }
};

export async function deleteBook(req, res) {
    const {
        isbn,
        id,
    } = req.body;

    const book = await bookModel.findOne({ isbn }).exec();

    if (book) {
        if (book.copies.length === 0) {
            await bookModel.deleteOne({ isbn }).exec();
            res.status(200).json(`Book: ${isbn} deleted.`);
        } else {
            const updatedBook = await bookModel.findOneAndUpdate(
                { isbn },
                { copies: book.copies.filter((it) => it.id !== id) },
                { useFindAndModify: false, new: true },
            ).exec();
            res.status(200).json(updatedBook);
        }
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}

export async function GetBookByID(isbn) {
    const book = await bookModel.findOne({ isbn }).exec();
    return book;
}

export async function GetBookOrFail(req, res) {
    const book = await bookModel.findOne(req.body.filter).exec();
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}

export async function GetAllBooksOrFail(req, res) {
    const books = await bookModel.find(req.body.filter).exec();
    if (books) { // if books are found, then books is an empty array.
        res.status(200).json(books);
    } else { // I don't think that this is ever called since find returns an empty array...
        res.status(400).json({ Error: "NotFound" });
    }
}

export const updateBook = async (req, res) => {
    const {
        isbn, title, author, pages, published, description,
    } = req.body;

    const book = await bookModel.findOne({ isbn }).exec();

    if (book) {
        const bookToUpdate = {};

        if (title) {
            bookToUpdate.title = title;
        }
        if (author) {
            bookToUpdate.author = author;
        }
        if (pages) {
            bookToUpdate.pages = pages;
        }
        if (published) {
            bookToUpdate.published = published;
        }
        if (description) {
            bookToUpdate.description = description;
        }
        await bookModel.updateOne(
            { isbn },
            bookToUpdate,
            { useFindAndModify: false, new: true },
        ).exec();
        res.status(200).json(bookToUpdate);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
};

export const getBooks = async (req, res) => {
    const allBooks = await bookModel.find();
    if (allBooks) {
        res.status(200).json(allBooks);
    } else {
        res.status(400).json({ Error: "Error" });
    }
};
