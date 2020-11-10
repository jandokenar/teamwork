import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

export const newUser = async (req, res) => {
    const {
        name, email, registration_date, role,
    } = req.body;

    const user = {
        name,
        email,
        registration_date,
        role,
    };

    user.password = bcrypt.hashSync(req.body.password, 10);
    user.id = await UserModel.countDocuments() + 1; // replace with real id generation
    user.fees = 0;
    user.borrowed = [];
    user.borrowedHistory = [];
    const userData = new UserModel(user);
    await userData.save();

    if (userData) {
        res.status(200).end(user);
    } else {
        res.status(404).end();
    }
};
