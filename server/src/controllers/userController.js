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
        res.status(400).json({ Error: "NotFound" })
    }
}
export async function ModifyUserOrFail(req, res) {
    const {
        id,
        password
    } = req.body;
    const filter = { id, password };
    const account = await UserModel.findOne(filter).exec();
    if (account) {
        const rd = req.body.replacementData;

        //Is there a better way to do this?
        const name = rd.name ? rd.name : account.name;
        const password = rd.password ? rd.password : account.password;
        const email = rd.email ? rd.email : account.email;
        
        const updatedAccount = await UserModel.findOneAndUpdate(
            filter,
            {...account,name,password,email},
            {useFindAndModify: false, new: true}
        ).exec();
        res.status(200).json(updatedAccount);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
