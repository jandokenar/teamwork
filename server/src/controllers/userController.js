import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

export const newUser = async (req, res) => {
    const {
        name, email, role,
    } = req.body;

    const user = {
        name,
        email,
        role,
    };

    user.password = bcrypt.hashSync(req.body.password, 10);
    user.registration_date = new Date();
    user.fees = 0;
    user.borrowed = [];
    user.borrowedHistory = [];

    const userData = new UserModel(user);
    const field = ["_id"];
    user.id = userData[field].toString();
    userData.id = user.id;

    await userData.save();
    if (userData) {
        res.status(200).json(user);
    } else {
        res.status(404).end();
    }
};

export async function GetUserOrFail(req, res) {
    const user = await UserModel.findOne(req.body.filter).exec();
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function GetAllUsersOrFail(req, res) {
    const allUsers = await UserModel.find().exec();
    if (allUsers) {
        res.status(200).json(allUsers);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function DeleteUserOrFail(req, res) {
    const {
        id,
    } = req.body;
    const filter = {
        id,
    };
    const user = await UserModel.findOneAndRemove(
        filter,
        { useFindAndModify: false },
    );
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
