import User from "../models/user.model.js";

// ✅ CREATE USER
export const createUser = async (data) => {
    return await User.create(data);
};

// ✅ FIND USER BY EMAIL
export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// ✅ FIND USER BY ID (optional, tapi penting nanti)
export const findUserById = async (id) => {
    return await User.findById(id);
};