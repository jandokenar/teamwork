import express from "express";
import {
    addBook,
    GetBookOrFail,
    updateBook,
    deleteBook,
} from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.post("/", addBook);
bookRouter.get("/", GetBookOrFail);
bookRouter.put("/", updateBook);
bookRouter.delete("/", deleteBook);
/*
bookRouter.get("/all", getBooks);
bookRouter.get("/search", searchBook);
bookRouter.post("/reserve", reserverBook);
*/
export default bookRouter;
