import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    isbn: String,
    title: String,
    author: String,
    published: Date,
    pages: Number,
    description: String,
    copies: [
        {
            id: String,
            status: String,
            due: Date,
            borrower: String,
            reserveList: [{ reserveId: String }],
        },
    ],
});

const bookModel = mongoose.model("book", bookSchema);

export default bookModel;
