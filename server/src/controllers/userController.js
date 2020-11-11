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
async function GetAndValidateRequestingUser(req) {
    const {
        id, password,
    } = req.body;
    const requester = await userModel.findOne({ id }).exec();
    if(bcrypt.compareSync(password, requester.password))
        return requester;
    return undefined;
}
export async function GetUserOrFail(req, res) {
    const requester = GetAndValidateRequestingUser(req);
    if (requester){
        const user = await UserModel.findOne(req.body.filter).exec();
        //Only allow normal users to seach themselves.
        if (user && (user.id === requester.id || requester.role === "admin")){
            res.status(200).json(user);
        } else {
            res.status(400).json({ Error: "NotFound" });
        }
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function GetAllUsersOrFail(req, res) {
    const requester = GetAndValidateRequestingUser(req);
    if (requester.role === "admin") {
        const allUsers = await UserModel.find().exec();
        if (allUsers) {
            res.status(200).json(allUsers);
        } else {
            res.status(400).json({ Error: "NotFound" });
        }
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function DeleteUserOrFail(req, res) {
    const requester = GetAndValidateRequestingUser(req);
    if (requester.role === "admin") {
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
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
export async function ModifyUserOrFail(req, res) {
    const requester = GetAndValidateRequestingUser(req);
    const { id, password } = req.body; 
    const account = (id) ? await UserModel.findOne(id).exec() : requester;
    if (account && (bcrypt.compareSync(password, account.password) ||
                    requester.role === "admin")) {
        const rd = req.body.replacementData;

        //Is there a better way to do this?
        const name = rd.name ? rd.name : account.name;
        const password = rd.password ? rd.password : account.password;
        const email = rd.email ? rd.email : account.email;
        const role = (rd.role && requester.role === "admin") ? rd.role : account.role; 

        const updatedAccount = await UserModel.findOneAndUpdate(
            filter,
            {...account,name,password,email,role},
            {useFindAndModify: false, new: true}
        ).exec();
        res.status(200).json(updatedAccount);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
