import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    registration_date: Date,
    id: String,
    role: String,
    fees: Number,
    borrowed: Array,
    borrowHistory: Array,
});
const UserModel = mongoose.model("user", userSchema);
export default UserModel;
