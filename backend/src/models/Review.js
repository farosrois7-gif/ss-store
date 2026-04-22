import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
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
        },

        // STATUS MODERATION
        status: {
            type: String,
            enum: ["pending", "approved", "hidden"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);