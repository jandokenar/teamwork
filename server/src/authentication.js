import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "./models/userModel.js";

const secretKey = "mysecretkey";
const refreshSecretKey = "mysecretkey";
const AT_EXPIRE_TIME = "15min";
const RT_EXPIRE_TIME = "1h";

//@NOTE:
//accesstoken has UserModel.id

//When 'accessToken' is authenticated. User is added to request as user (request.account)
//When 'refreshToken' is authenticated, UserID is added to request as decoded (request.decoded)
export const CreateTokens = (userID) => (
    {
        token: jwt.sign({ userID }, secretKey, { expiresIn: AT_EXPIRE_TIME }),
        refreshToken: jwt.sign({ userID }, refreshSecretKey, { expiresIn: RT_EXPIRE_TIME }),
    }
);
export const RenewAccessToken = (req, res) => {
    // Renew access token while refresh token is valid.
    const tokens = CreateTokens(req.body.decoded.userID);
    res.status(200).json({ token: tokens.token });
};
export const AuthenticateLocal = (req, res, next) => {
    console.log(req.body.email);
    console.log(req.body.password);
    if (!req.body.email || !req.body.password) {
        return res.status(403).json({ Error: "Not Authorized" });
    }
    UserModel.findOne({ email: req.body.email }).then(async (it) => {
        if (!it) return res.status(403).json({ Error: "Not Found" });
        const isMatch = bcrypt.compareSync(req.body.password, it.password);
        if (!isMatch) return res.status(403).json({ Error: "Not Authorized" });
        req.body = {...req.body, userID: it.id };
        next();
    });
    return;
};
export const AuthenticateAccessToken = (req, res, next) => {
    if (!req.headers.authentication) return res.status(403).json({ Error: "NoToken" });
    const token = req.headers.authentication.split(" ")[1];
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json(err);
        }
        UserModel.findOne({ id: decoded.userID }).then(async (it) => {
            if (!it) return res.status(403).json({ Error: "User Not Found" });

            req.body = { ...req.body,  user: it };
            next();
        });
    });
};
export const AuthenticateRefreshToken = (req, res, next) => {
    const {
        cookies,
    } = req;
    jwt.verify(cookies.refreshToken, refreshSecretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json(err);
        }
        req.body = { ...req.body, decoded };
    });
    next();
};
