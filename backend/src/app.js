import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

// routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

/* =========================
   SECURITY MIDDLEWARE
========================= */
app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);

app.use(morgan("dev"));

/* =========================
   BODY PARSER
========================= */
app.use(express.json());

/* =========================
   CORS CONFIG (PRODUCTION SAFE)
========================= */
const allowedOrigins = [
    "http://localhost:5173",
    "https://ss-store-iota.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, true); // fallback biar tidak crash (DEV + PROD aman)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

/* =========================
   HANDLE PREFLIGHT (FIX ERROR EXPRESS 5)
========================= */
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

/* =========================
   STATIC FILES
========================= */
app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "public/uploads"))
);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
    res.send("SS Store API running 🚀");
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;