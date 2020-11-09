import express from "express";
import {
    newBook,
    getBook,
    getBooks,
    deleteBook,
    modifyBook,
    searchBook,
    reserverBook,
} from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.get("/", (req, res) => {
    res.send("hello from library");
});

bookRouter.post("/book", newBook);
bookRouter.get("/book", getBook);
bookRouter.get("/books", getBooks);
bookRouter.delete("/book", deleteBook);
bookRouter.put("/book", modifyBook);
bookRouter.get("/book/search", searchBook);
bookRouter.post("book/reserve", reserverBook);

export default bookRouter;
