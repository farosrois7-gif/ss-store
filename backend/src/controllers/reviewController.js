import Review from "../models/Review.js";

/* ================= USER ================= */

// GET by product
export const getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({
            productId: req.params.productId,
        }).sort({ createdAt: -1 });

        res.json({ data: reviews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE (🔐 wajib login)
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        const review = await Review.create({
            productId,
            userName: req.user?.id || "User", // ✅ FIX DI SINI
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

        res.json({ data: reviews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE
export const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);

        res.json({ message: "Review dihapus" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};