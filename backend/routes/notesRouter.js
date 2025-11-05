import express from 'express';
import { createNote, deleteNote, getAllNotes, getNoteById, searchNotes, updateNote } from '../controllers/notesController.js';
import validateToken from '../middlewares/authMiddleware.js';

const notesRouter = express.Router();

notesRouter.use(validateToken);

notesRouter.get("/", getAllNotes);

notesRouter.get("/search", searchNotes);

notesRouter.get("/:id", getNoteById);

notesRouter.post("/", createNote);

notesRouter.put("/:id", updateNote);

notesRouter.delete("/:id", deleteNote);


 
export default notesRouter;