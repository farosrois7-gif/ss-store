import Review from "../models/Review.js";

/* ================= PUBLIC ================= */

// GET REVIEW BY PRODUCT (HANYA APPROVED)
export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({
            productId,
            status: "approved",
        })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: reviews });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/* ================= USER ================= */

// CREATE REVIEW (MASUK PENDING)
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({
                message: "Data wajib diisi",
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating 1 - 5",
            });
        }

        // 1 USER 1 REVIEW
        const existing = await Review.findOne({
            productId,
            userId: req.user.id,
        });

        if (existing) {
            return res.status(400).json({
                message: "Kamu sudah review produk ini",
            });
        }

        const review = await Review.create({
            productId,
            userId: req.user.id,
            rating,
            comment,
            status: "pending",
        });

        res.status(201).json({ data: review });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/* ================= ADMIN PANEL ================= */

// GET ALL REVIEW (ADMIN PANEL)
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("userId", "name")
            .populate("productId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: reviews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// APPROVE REVIEW
export const approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );

        res.json({ data: review });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// HIDE REVIEW
export const hideReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status: "hidden" },
            { new: true }
        );

        res.json({ data: review });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE REVIEW
export const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);

        res.json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};