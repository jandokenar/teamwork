import UserModel from "../models/UserModel.js";

export async function GetAllUsersOrFail(req, res) {
    const allUsers = await UserModel.find().exec();
    if (allUsers) {
        res.status(200).json(allUsers);
    } else {
        res.status(400).json(Error: "NotFound");
    }
}
