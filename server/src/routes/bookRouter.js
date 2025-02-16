import express from "express";
import {
    addBook,
    getBook,
    updateBook,
    getBooks,
    deleteBook,
} from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.post("/", addBook);
bookRouter.put("/", updateBook);
bookRouter.get("/all/", getBooks);
bookRouter.get("/:isbn/", getBook);
bookRouter.delete("/", deleteBook);

/*
bookRouter.get("/search", searchBook);
*/
export default bookRouter;
