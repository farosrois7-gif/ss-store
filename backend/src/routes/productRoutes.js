import express from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getProducts);

// 🔥 tambahin upload.single("image")
router.post("/", upload.single("image"), createProduct);

router.put("/:id", upload.single("image"), updateProduct);

router.delete("/:id", deleteProduct);

export default router;