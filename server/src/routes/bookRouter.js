import express from "express";
import {
    addBook,
    GetBookOrFail,
    updateBook,
    getBooks,
    deleteBook,
} from "../controllers/bookController.js";
const bookRouter = express.Router();

bookRouter.post("/", addBook);
bookRouter.get("/", GetBookOrFail);
bookRouter.put("/", updateBook);
bookRouter.get("/all/", getBooks);
/*
bookRouter.delete("/", deleteBook);
bookRouter.put("/", updateBook);

bookRouter.get("/all", getBooks);
bookRouter.get("/search", searchBook);
bookRouter.post("/reserve", reserverBook);
*/
export default bookRouter;
