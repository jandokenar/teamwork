import express from "express";
import {
    newUser,
    ModifyUserOrFail,
    userBorrowBook,
    ReserveBookForUserOrFail,
    userReturnBook,
    GetUserOrFail,
    GetAllUsersOrFail,
    DeleteUserOrFail,
} from "../controllers/userController.js";

const userRouter = express.Router();

const stub = (req, res) => { };

userRouter.get("/borrow/", stub);

userRouter.post("/", newUser);
userRouter.post("/borrow/", userBorrowBook);
userRouter.post("/return/", userReturnBook);
userRouter.get("/", GetUserOrFail);
userRouter.get("/all/", GetAllUsersOrFail);
userRouter.put("/", ModifyUserOrFail);
userRouter.put("/reserve/", ReserveBookForUserOrFail);
userRouter.delete("/", DeleteUserOrFail);

export default userRouter;
