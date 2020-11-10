import express from "express";
import {
    addBook,
    /*
    getBook,
    getBooks,
    deleteBook,
    modifyBook,
    searchBook,
    reserverBook,
    */
} from "../controllers/bookController.js";

const bookRouter = express.Router();

bookRouter.get("/", (req, res) => {
    res.send("hello from library book router");
});

bookRouter.post("/", addBook);
/*
bookRouter.get("/", getBook);
bookRouter.get("/all", getBooks);
bookRouter.delete("/", deleteBook);
bookRouter.put("/", modifyBook);
bookRouter.get("/search", searchBook);
bookRouter.post("/reserve", reserverBook);
*/

export default bookRouter;
