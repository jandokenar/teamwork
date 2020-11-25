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
import {
    AuthenticateLocal,
    CreateTokens
} from "../authentication.js";

const userRouter = express.Router();

userRouter.post("/login/", AuthenticateLocal, (req, res) => {
    const { userID } = req.body;
    const tokens = CreateTokens(userID);
    console.log(userID);
    res.cookie("refreshToken", tokens.refreshToken)
        .status(200)
        .json({ token: tokens.token });
});

userRouter.post("/logout/", (req, res) => {
    res.clearCookie("refreshToken")
        .status(200)
        .json({ token: null });
});
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
