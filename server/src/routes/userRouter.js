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
    GetUsersCurrentlyBorrowedBooksOrFail,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/borrow/", GetUsersCurrentlyBorrowedBooksOrFail);

userRouter.post("/", newUser);
userRouter.post("/borrow/", userBorrowBook);
userRouter.post("/return/", userReturnBook);
userRouter.get("/", GetUserOrFail);
userRouter.get("/all/", GetAllUsersOrFail);
userRouter.put("/", ModifyUserOrFail);
userRouter.put("/reserve/", ReserveBookForUserOrFail);
userRouter.delete("/", DeleteUserOrFail);

export default userRouter;
