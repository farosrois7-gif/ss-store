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

/* =========================
   🔥 DEBUG ROUTE (WAJIB BUAT CEK)
========================= */
router.get("/test", (req, res) => {
    res.send("SALE ROUTE ACTIVE 🔥");
});
/* =========================
   🔥 USER ROUTES (SPESIFIK)
========================= */
router.get("/me", authMiddleware, getMySales);
router.get("/dashboard", getDashboard);

/* =========================
   🔥 MAIN ROUTES
========================= */
router.get("/", getSales);

// 🔥 INI YANG PENTING (POST HARUS ADA)
router.post("/", authMiddleware, createSale);

/* =========================
   🔥 PARAM ROUTES (PALING BAWAH)
========================= */
router.put("/:id", updateStatus);
router.delete("/:id", deleteSale);

export default router;