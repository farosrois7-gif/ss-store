import jwt from "jsonwebtoken";

// ✅ middleware auth (cek login)
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // cek ada token atau tidak
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized - No token",
            });
        }

        // ambil token
        const token = authHeader.split(" ")[1];

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // simpan ke request
        req.user = decoded;

        next(); // lanjut ke controller
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized - Invalid token",
        });
    }
};