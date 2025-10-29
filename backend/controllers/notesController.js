import Folder from "../models/folderModel.js";
import Note from "../models/notesModel.js";


const getAllNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({ user_id: req.user.id }).populate("folder_id", "name").sort({ createdAt: -1 });


        const formattedNotes = notes.map(note => ({
            id: note._id,
            folder: note.folder_id ? note.folder_id.name : "Uncategorized",
            title: note.title,
            content: note.content,
            date: new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        }));

        res.sendResponse(formattedNotes, 200);
    }
    catch (error) {
        next(error);
    }
};

const getNoteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const note = await Note.findOne({ _id: id, user_id: req.user.id }); 
        if (!note) {
            const error = new Error(`Note with ID ${id} not found`);
            error.statusCode = 404;
            return next(error);
        }
        res.sendResponse(note, 200);
    }
    catch (error) {
        next(error);
    }
};

const createNote = async (req, res, next) => {
    try {
        const { title, content, folder_id } = req.body;
        if (!title || !content || !folder_id) {
            const error = new Error("Title, Content and Folder ID are required");
            error.statusCode = 400;
            return next(error);
        }

        const folder = await Folder.findOne({ _id: folder_id, user_id: req.user.id });
        if (!folder) {
            const error = new Error(`Folder with ID ${folder_id} not found`);
            error.statusCode = 404;
            return next(error);
        }

        const newNote = new Note({ user_id: req.user.id, folder_id: folder_id, title, content });
        await newNote.save();
        res.sendResponse(newNote, 201);
    }
    catch (error) {
        next(error);
    }
};



const updateNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, folder_id } = req.body;

        if (!title && !content && !folder_id) {
            const error = new Error("At least one field (title, content or folder_id) must be provided");
            error.statusCode = 400;
            return next(error);
        }

        const updatedData = {};
        if (title) updatedData.title = title;
        if (content) updatedData.content = content;
        if (folder_id) {
            const folder = await Folder.findOne({ _id: folder_id, user_id: req.user.id });
            if (!folder) {
                const error = new Error(`Folder with ID ${folder_id} not found`);
                error.statusCode = 404;
                return next(error);
            }
            updatedData.folder_id = folder_id;
        }

        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            updatedData,
            { new: true }
        );

        if (!updatedNote) {
            const error = new Error(`Note with ID ${id} not found`);
            error.statusCode = 404;
            return next(error);
        }

        res.sendResponse(updatedNote, 200);
    }
    catch (error) {
        next(error);
    }
};

const deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedNote = await Note.findByIdAndDelete({ _id: id, user_id: req.user.id });
        if (!deletedNote) {
            const error = new Error(`Note with ID ${id} not found`);
            error.statusCode = 404;
            return next(error);
        }
        res.sendResponse(deletedNote, 200);
    }
    catch (error) {
        next(error);
    }
};



export { getAllNotes,  createNote, updateNote, deleteNote, getNoteById };