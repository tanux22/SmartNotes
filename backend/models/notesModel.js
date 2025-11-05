import mongoose from "mongoose";
import { tagSchema } from "./tagSchema.js";

const noteSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    folder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [tagSchema],
}, {
    timestamps: true
});



const Note = mongoose.model("Note", noteSchema);
export default Note;