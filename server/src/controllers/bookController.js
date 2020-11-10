import bookModel from "../models/bookModel.js";

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
export async function GetBookOrFail(req,res) {
    const book = await bookModel.findOne(req.body.filter).exec();
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
