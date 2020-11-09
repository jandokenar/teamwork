import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: Number,
    registration_date: Date,
    id: Number,
    role: String,
    fees: Number,
    borrowed: Array,
    borrowHistory: Array,
});
const UserModel = mongoose.model("user", userSchema);
export default UserModel;
