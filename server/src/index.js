import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import bookRouter from "./routes/bookRouter.js";

const requestLogger = (req, res, next) => {
    console.log(`METHOD: ${req.method}`);
    console.log(`PATH: ${req.path}`);
    console.log("BODY: ", req.body);
    console.log("-----");
    next();
};

const port = 5000;
const DBurl = "mongodb://localhost:27017/libraryDB";
async function ConnectToDB() {
    try {
        await mongoose.connect(DBurl, { useNewUrlParser: true, useUnifiedTopology: true });
        return 1;
    } catch (e) {
        console.log(e);
        return 0;
    }
}

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authentication");
    next();
});

app.use(requestLogger);

app.use("/library/user/", userRouter);
app.use("/library/book/", bookRouter);

if (ConnectToDB()) {
    app.listen(port, () => console.log(`Listening to port ${port}`));
}
