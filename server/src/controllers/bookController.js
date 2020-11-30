import bookModel from "../models/bookModel.js";

export const addBook = async (req, res) => {
    const {
        isbn, title, author, published, pages, description,
    } = req.body;
    const findBook = await bookModel.findOne({ isbn }).exec();

    if (findBook) {
        const newCopy = {
            id: findBook.copies[findBook.copies.length - 1].id + 1,
            status: "in_library",
        };
        const updatedCopies = [...findBook.copies, newCopy];
        const updatedBook = await bookModel.updateOne(
            { isbn },
            { copies: updatedCopies },
            { useFindAndModify: false, new: true },
        ).exec();
        console.log("Updated:", updatedBook);
        res.status(200).json(updatedBook);
    } else {
        const book = {
            isbn,
            title,
            author,
            published,
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
        res.status(200).json(newBook);
    }
};

export async function deleteBook(req, res) {
    const {
        isbn,
        id,
    } = req.body;

    const book = await bookModel.findOne({ isbn }).exec();

    if (book) {
        if (book.copies.length === 1) {
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
        res.status(400).json({ Error: "Not Found" }).end();
    }
}

export async function GetBookByID(isbn) {
    const book = await bookModel.findOne({ isbn }).exec();
    return book;
}

export async function getBook(req, res) {
    const { isbn } = { isbn: req.params.isbn };
    const book = await GetBookByID(isbn);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(400).json({ Error: "Not Found" }).end();
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
        res.status(400).json({ Error: "NotFound" }).end();
    }
};

export const getBooks = async (req, res) => {
    const allBooks = await bookModel.find();
    if (allBooks) {
        res.status(200).json(allBooks);
    } else {
        res.status(400).json({ Error: "Error" }).end();
    }
};
