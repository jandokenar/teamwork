import express from "express";
import {
    newUser,
    ModifyUserOrFail,
    userBorrowBook,
} from "../controllers/userController.js";

const userRouter = express.Router();

const stub = (req, res) => { };

userRouter.get("/borrow/", stub);
userRouter.post("/", newUser);
userRouter.post("/borrow/", userBorrowBook);
userRouter.post("/return/", stub);
userRouter.get("/", stub);
userRouter.get("/all/", stub);
userRouter.put("/", ModifyUserOrFail);
userRouter.delete("/", stub);

export default userRouter;
