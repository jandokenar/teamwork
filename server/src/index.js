import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import bookRouter from "./routes/bookRouter.js";
import MaybeInitializeBookCollection from "./SampleBookCollection.js"

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

app.use(express.json());

app.use(requestLogger);

app.use("/library/user/", userRouter);
app.use("/library/book/", bookRouter);

if (ConnectToDB()) {
    console.log("Connected");
    await MaybeInitializeBookCollection(); //not sure if we need to wait for this
    app.listen(port, () => console.log(`Listening to port ${port}`));
}
