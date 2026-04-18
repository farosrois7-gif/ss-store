import express from "express";
import { getSales, createSale, updateStatus, deleteSale, getMySales, getDashboard } from "../controllers/saleController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", getSales);
router.get("/dashboard", getDashboard);
router.post("/", authMiddleware,createSale);
router.put("/:id", updateStatus);
router.delete("/:id", deleteSale);
router.get("/me", authMiddleware, getMySales);

export default router;