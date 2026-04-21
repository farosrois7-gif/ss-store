import Review from "../models/Review.js";

/* ================= USER ================= */

// GET by product
export const getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({
            productId: req.params.productId,
        }).sort({ createdAt: -1 });

        res.status(200).json({ data: reviews });
    } catch (err) {
        console.log("GET REVIEWS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// CREATE REVIEW
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        // ❌ VALIDASI WAJIB
        if (!productId || !rating || !comment) {
            return res.status(400).json({
                message: "productId, rating, comment wajib diisi",
            });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized user",
            });
        }

        const review = await Review.create({
            productId,
            userId: req.user.id, // ✅ pakai ID user (lebih benar)
            userName: req.user.name || "User", // optional kalau ada di token
            rating,
            comment,
        });

        res.status(201).json({ data: review });
    } catch (err) {
        console.log("CREATE REVIEW ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

/* ================= ADMIN ================= */

// GET ALL
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("productId", "name")
            .populate("userId", "name email");

        res.status(200).json({ data: reviews });
    } catch (err) {
        console.log("GET ALL REVIEWS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE
export const deleteReview = async (req, res) => {
    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Review tidak ditemukan",
            });
        }

        res.status(200).json({ message: "Review dihapus" });
    } catch (err) {
        console.log("DELETE REVIEW ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};