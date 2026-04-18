import { registerService, loginService } from "../services/auth.service.js";

// ✅ REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // validasi basic (professional practice)
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const result = await registerService({ name, email, password });

        res.status(201).json({
            message: "User registered successfully",
            data: result,
        });

    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


// ✅ LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validasi basic
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const result = await loginService({ email, password });

        res.status(200).json({
            message: "Login successful",
            data: result,
        });

    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};