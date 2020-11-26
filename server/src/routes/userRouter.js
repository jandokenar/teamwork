import express from "express";
import {
    Login,
    Logout,
    RenewLogin,
    CreateNewUser,
    ModifyUserOrFail,
    UserBorrowBook,
    ReserveBookForUserOrFail,
    UserReturnBook,
    GetUserOrFail,
    GetAllUsersOrFail,
    DeleteUserOrFail,
    GetUsersCurrentlyBorrowedBooksOrFail,
} from "../controllers/userController.js";
import {
    AuthenticateLocal,
    AuthenticateAccessToken,
    AuthenticateRefreshToken
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
                CreateNewUser);
userRouter.post("/borrow/",
                AuthenticateAccessToken,
                UserBorrowBook);
userRouter.post("/return/",
                AuthenticateAccessToken,
                UserReturnBook);
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
