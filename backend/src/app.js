import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

// routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";

const app = express();

// ✅ middleware security & logging
app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);
app.use(morgan("dev"));

// ✅ middleware parsing
app.use(express.json());

// ✅ CORS (biar frontend bisa akses)
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ss-store-iota.vercel.app"
    ],
    credentials: true
}));

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// ✅ health check (biar tau server hidup)
app.get("/", (req, res) => {
    res.send("SS Store API running 🚀");
});

// ✅ routes utama
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

export default app;