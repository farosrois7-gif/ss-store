// 👑 ADMIN ONLY MIDDLEWARE
export const adminMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden - Admin only",
            });
        }

        next();
    } catch (error) {
        console.log("ADMIN MIDDLEWARE ERROR:", error.message);

        return res.status(500).json({
            message: "Server error",
        });
    }
};