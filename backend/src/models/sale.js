import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },

    // 🔥 TAMBAH INI
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    paymentMethod: {
        type: String,
        enum: ["cod", "transfer", "ewallet", "qris"],
        default: "cod",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },

    quantity: Number,
    totalPrice: Number,
    status: {
        type: String,
        enum: ["pending", "success", "cancel"],
        default: "pending",
    },
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);