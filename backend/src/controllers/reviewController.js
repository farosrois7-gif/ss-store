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
        const { rating, comment, productId } = req.body;

        // ambil dari token
        const userId = req.user.id;
        const userName = req.user.name;

        // ❗ prevent spam (1 user 1 review / product)
        const existing = await Review.findOne({ productId, userId });
        if (existing) {
            return res.status(400).json({
                message: "Kamu sudah memberi review produk ini",
            });
        }

        const review = await Review.create({
            productId,
            userId,
            userName,
            rating,
            comment,
        });

        res.status(201).json({ data: review });
    } catch (err) {
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