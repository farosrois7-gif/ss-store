import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../repositories/user.repository.js";
import { generateToken } from "../utils/token.js";

// ✅ REGISTER SERVICE
export const registerService = async ({ name, email, password }) => {
    // cek user sudah ada atau belum
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user ke database
    const user = await createUser({
        name,
        email,
        password: hashedPassword,
    });

    // generate token
    const token = generateToken(user);

    return {
        user,
        token,
    };
};


// ✅ LOGIN SERVICE
export const loginService = async ({ email, password }) => {
    // cari user
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    // cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    // generate token
    const token = generateToken(user);

    return {
        user,
        token,
    };
};