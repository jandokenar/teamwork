import bookModel from "../models/bookModel.js";

export const addBook = async (req, res) => {
    const {
        isbn, title, author, pages, description,
    } = req.body;

    const findBook = await bookModel.findOne({ title }).exec();

    if (findBook) {
        const newCopy = {
            id: findBook.copies.length + 1, // väliaikainen id ratkaisu
            status: "in_library",
        };
        const updatedCopies = [...findBook.copies, newCopy];
        const updatedBook = await bookModel.updateOne(
            { title },
            { copies: updatedCopies },
            { useFindAndModify: false, new: true },
        ).exec();
        res.status(200).json(updatedBook.copies);
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
                    id: "1",
                    status: "in_library",
                },
            ],

        };

        const newBook = await bookModel(book);

        newBook.save();

        res.status(201).json(newBook);
    }
};

export async function DeleteBookOrFail(req, res) {
    const {
        id,
    } = req.body;
    const filter = {
        id,
    };
    const book = await bookModel.findOneAndRemove(filter).exec();

    if (book) {
        const updatedBook = await bookModel.findOneAndUpdate(
            filter,
            { copies: book.copies.filter((it) => it.id !== req.body.copy) },
            { useFindAndModify: false, new: true },
        ).exec();
        res.status(200).json(updatedBook);
    }
}

export async function GetBookOrFail(req, res) {
    const book = await bookModel.findOne(req.body.filter).exec();
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
