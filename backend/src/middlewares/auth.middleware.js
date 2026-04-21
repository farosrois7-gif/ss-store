import jwt from "jsonwebtoken";

// ✅ middleware auth (cek login)
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // ❌ tidak ada token
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized - No token",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - Token missing",
            });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token",
            });
        }

        // simpan ke request
        req.user = decoded;

        next();
    } catch (error) {
        console.log("AUTH ERROR:", error.message);

        return res.status(401).json({
            message: "Unauthorized - Invalid token",
            error: error.message,
        });
    }
};