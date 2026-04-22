import express from "express";
import {
    getReviewsByProduct,
    createReview,
    getAllReviews,
    approveReview,
    hideReview,
    deleteReview,
} from "../controllers/reviewController.js";

import {
    authMiddleware,
    adminOnly,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/:productId", getReviewsByProduct);

/* ================= USER ================= */
router.post("/", authMiddleware, createReview);

/* ================= ADMIN PANEL ================= */
router.get("/", authMiddleware, adminOnly, getAllReviews);

router.patch("/:id/approve", authMiddleware, adminOnly, approveReview);
router.patch("/:id/hide", authMiddleware, adminOnly, hideReview);
router.delete("/:id", authMiddleware, adminOnly, deleteReview);

export default router;