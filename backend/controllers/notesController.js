import Folder from "../models/folderModel.js";
import Note from "../models/notesModel.js";
import { extractTextFromJSON, generateTagsWithCount } from "../utils/Notes.js";


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

        const extractedText = extractTextFromJSON(content);
        console.log("Extracted Text:", extractedText);

        const tags = generateTagsWithCount(extractedText);
        console.log("Generated Tags:", tags);

        const newNote = new Note({ user_id: req.user.id, folder_id: folder_id, title, content, tags });
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
        if (content) {
            updatedData.content = content;
            const extractedText = extractTextFromJSON(content);
            const tags = generateTagsWithCount(extractedText);
            updatedData.tags = tags;
        }

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

// controllers/noteController.js

const searchNotes = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      const error = new Error("Search query is required");
      error.statusCode = 400;
      return next(error);
    }

    // Tokenize query into words
    const searchWords = query
      .toLowerCase()
      .match(/\b[a-z]{3,}\b/g)
      ?.filter(Boolean) || [];

    if (searchWords.length === 0) {
      return res.sendResponse([], 200);
    }

    // Fetch user notes
    const notes = await Note.find({ user_id: req.user.id });

    // If notes array is empty
    if (!notes.length) {
      return res.sendResponse([], 200);
    }

    // Rank by matching tag counts
    const rankedNotes = notes
      .map((note) => {
        let score = 0;
        for (const tag of note.tags || []) {
          if (searchWords.includes(tag.tag)) {
            score += tag.count;
          }
        }
        return { id: note._id, title: note.title, score };
      })
      .filter((n) => n.score > 0)
      .sort((a, b) => b.score - a.score);

    res.sendResponse(rankedNotes, 200);
  } catch (error) {
    console.error("Search error:", error);
    next(error);
  }
};



export { getAllNotes, createNote, updateNote, deleteNote, getNoteById, searchNotes };