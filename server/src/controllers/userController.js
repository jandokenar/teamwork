import UserModel from "../models/UserModel.js";

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
export async function DeleteUserOrFailt(req, res) {
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

}