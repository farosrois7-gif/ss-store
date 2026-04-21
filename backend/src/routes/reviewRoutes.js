import express from "express";
import {
    getReviewsByProduct,
    createReview,
    getAllReviews,
    deleteReview,
} from "../controllers/reviewController.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/:productId", getReviewsByProduct);

// USER
router.post("/", authMiddleware, createReview);

// ADMIN (sementara auth dulu)
router.get("/", authMiddleware, getAllReviews);
router.delete("/:id", authMiddleware, deleteReview);

export default router;