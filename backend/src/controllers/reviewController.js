import Review from "../models/Review.js";

/* ================= PUBLIC ================= */

// GET REVIEW BY PRODUCT (ONLY APPROVED)
export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                message: "productId wajib diisi",
            });
        }

        const reviews = await Review.find({
            productId,
            status: "approved",
        })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: reviews });
    } catch (err) {
        console.log("GET REVIEWS ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

/* ================= USER ================= */

// CREATE REVIEW (DEFAULT PENDING)
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        // VALIDASI FIELD
        if (!productId || !rating || !comment) {
            return res.status(400).json({
                message: "productId, rating, comment wajib diisi",
            });
        }

        // VALIDASI RATING
        const safeRating = Number(rating);

        if (safeRating < 1 || safeRating > 5) {
            return res.status(400).json({
                message: "Rating harus 1 - 5",
            });
        }

        // VALIDASI USER LOGIN
        if (!req.user?.id) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        // CEK REVIEW DUPLIKAT
        const existing = await Review.findOne({
            productId,
            userId: req.user.id,
        });

        if (existing) {
            return res.status(400).json({
                message: "Kamu sudah review produk ini",
            });
        }

        // CREATE REVIEW
        const review = await Review.create({
            productId,
            userId: req.user.id,
            rating: safeRating,
            comment,
            status: "pending",
        });

        return res.status(201).json({ data: review });
    } catch (err) {
        console.log("CREATE REVIEW ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

/* ================= ADMIN ================= */

// GET ALL REVIEWS (ADMIN PANEL)
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("userId", "name email")
            .populate("productId", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: reviews });
    } catch (err) {
        console.log("GET ALL REVIEWS ERROR:", err);
        return res.status(500).json({ message: err.message });
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

        if (!review) {
            return res.status(404).json({
                message: "Review tidak ditemukan",
            });
        }

        return res.status(200).json({ data: review });
    } catch (err) {
        console.log("APPROVE ERROR:", err);
        return res.status(500).json({ message: err.message });
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

        if (!review) {
            return res.status(404).json({
                message: "Review tidak ditemukan",
            });
        }

        return res.status(200).json({ data: review });
    } catch (err) {
        console.log("HIDE ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

// DELETE REVIEW
export const deleteReview = async (req, res) => {
    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Review tidak ditemukan",
            });
        }

        return res.status(200).json({
            message: "Review deleted",
        });
    } catch (err) {
        console.log("DELETE ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};