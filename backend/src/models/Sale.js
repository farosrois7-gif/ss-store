import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({

    // =========================
    // ORDER ID (WAJIB UNTUK GATEWAY)
    // =========================
    orderId: {
        type: String,
        required: true,
        unique: true,
    },

    // =========================
    // USER
    // =========================
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // =========================
    // ITEMS (SNAPSHOT PRODUK)
    // =========================
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            subtotal: {
                type: Number,
                required: true,
            },
        },
    ],

    // =========================
    // TOTAL
    // =========================
    totalPrice: {
        type: Number,
        required: true,
    },

    shippingCost: {
        type: Number,
        default: 0,
    },

    grandTotal: {
        type: Number,
        required: true,
    },

    // =========================
    // ADDRESS
    // =========================
    address: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        detail: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String },
    },

    // =========================
    // PAYMENT (GATEWAY READY)
    // =========================
    payment: {
        method: {
            type: String,
            enum: ["cod", "transfer", "ewallet", "qris"],
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "paid", "failed", "expired"],
            default: "pending",
        },

        paidAt: Date,

        // 🔥 GATEWAY DATA
        transactionId: String,   // dari Midtrans/Xendit
        paymentUrl: String,      // redirect URL
        snapToken: String,       // khusus Midtrans Snap
        expiryTime: Date,        // waktu kadaluarsa pembayaran
    },

    // =========================
    // ORDER STATUS
    // =========================
    status: {
        type: String,
        enum: [
            "pending",
            "paid",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ],
        default: "pending",
    },

    // =========================
    // SHIPPING
    // =========================
    shipping: {
        courier: String,
        service: String,
        trackingNumber: String,
        shippedAt: Date,
        deliveredAt: Date,
    },

}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);