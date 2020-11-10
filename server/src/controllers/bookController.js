import bookModel from "../models/bookModel.js";

export async function GetBookOrFailt(req,res) {
    const book = await bookModel.findOne(req.body.filter).exec();
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
