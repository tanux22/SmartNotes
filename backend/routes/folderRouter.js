import express from 'express';
import { createFolder, deleteFolder, getAllFolders, getFolderById, getNotesByFolder, updateFolder } from '../controllers/foldersController.js';
import validateToken from '../middlewares/authMiddleware.js';


const foldersRouter = express.Router();

foldersRouter.use(validateToken);

// get notes by folder ID
foldersRouter.get("/:folder_id/notes", getNotesByFolder);

// get all folders
foldersRouter.get("/", getAllFolders);

// get folder by ID
foldersRouter.get("/:id", getFolderById);

// create a new folder
foldersRouter.post("/", createFolder);

// update a folder by ID
foldersRouter.put("/:id", updateFolder);

// delete a folder by ID 
foldersRouter.delete("/:id", deleteFolder);

export default foldersRouter;

