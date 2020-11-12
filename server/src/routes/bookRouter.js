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
bookRouter.get("/", getBook);
bookRouter.put("/", updateBook);
bookRouter.get("/all/", getBooks);
bookRouter.delete("/", deleteBook);

/*
bookRouter.get("/search", searchBook);
bookRouter.post("/reserve", reserverBook);
*/
export default bookRouter;
