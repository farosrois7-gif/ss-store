import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            required: true,
            trim: true,
        },

        // 🔥 ADMIN MODERATION SYSTEM
        status: {
            type: String,
            enum: ["pending", "approved", "hidden"],
            default: "pending",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Review", reviewSchema);