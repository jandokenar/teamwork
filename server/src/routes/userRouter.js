import express from "express";
import {
    Login,
    Logout,
    RenewLogin,
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
    AuthenticateAccessToken,
    AuthenticateRefreshToken,
    CreateTokens
} from "../authentication.js";

const userRouter = express.Router();

userRouter.post("/login/",
                AuthenticateLocal,
                Login);
userRouter.post("/logout/",
                Logout);
userRouter.post("/refresh",
                AuthenticateRefreshToken,
                RenewLogin);
userRouter.get("/borrow/",
               AuthenticateAccessToken,
               GetUsersCurrentlyBorrowedBooksOrFail);
userRouter.post("/",
                newUser);
userRouter.post("/borrow/",
                AuthenticateAccessToken,
                userBorrowBook);
userRouter.post("/return/",
                AuthenticateAccessToken,
                userReturnBook);
userRouter.get("/",
               AuthenticateAccessToken,
               GetUserOrFail);
userRouter.get("/all/",
               GetAllUsersOrFail);
userRouter.put("/",
               AuthenticateAccessToken,
               ModifyUserOrFail);
userRouter.put("/reserve/",
               AuthenticateAccessToken,
               ReserveBookForUserOrFail);
userRouter.delete("/",
                  AuthenticateAccessToken,
                  DeleteUserOrFail);

export default userRouter;
