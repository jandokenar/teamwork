import UserModel from "../models/userModel.js";

export async function GetUserOrFail(req, res) {
    const user = await UserModel.findOne(req.body.filter).exec();
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).json({ Error: "NotFound" });
    }
}
