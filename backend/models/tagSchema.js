import mongoose from "mongoose";

export const tagSchema = new mongoose.Schema(
    {
        tag: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

