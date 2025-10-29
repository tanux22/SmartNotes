import mongoose from "mongoose";

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
    }
}, {
    timestamps: true
});

const Note = mongoose.model("Note", noteSchema);
export default Note;