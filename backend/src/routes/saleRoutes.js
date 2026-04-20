import express from "express";
import {
    getSales,
    createSale,
    updateStatus,
    deleteSale,
    getMySales,
    getDashboard
} from "../controllers/saleController.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// =========================
// 🔥 USER ROUTES (SPECIFIC FIRST)
// =========================
router.get("/me", authMiddleware, getMySales);
router.get("/dashboard", getDashboard);

// =========================
// 🔥 MAIN ROUTES
// =========================
router.get("/", getSales);
router.post("/", authMiddleware, createSale);

// =========================
// 🔥 PARAM ROUTES (HARUS PALING BAWAH)
// =========================
router.put("/:id", updateStatus);
router.delete("/:id", deleteSale);

export default router;