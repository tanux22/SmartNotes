import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;