import Folder from "../models/folderModel.js";
import Note from "../models/notesModel.js";



const getNotesByFolder = async (req, res, next) => {
    try {
        const { folder_id } = req.params;

        const notes = await Note.find({ user_id: req.user.id, folder_id: folder_id }).sort({ createdAt: -1 });
        res.sendResponse(notes, 200);
    }
    catch (error) {
        next(error);
    }
};

const getAllFolders = async (req, res, next) => {
    try{
        const folders = await Folder.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        if(!folders){
            const error = new Error("No folders found");
            error.statusCode = 404;
            return next(error);
        }
        res.sendResponse(folders, 200);

    }catch(error){
        next(error);
    }
};

const getFolderById = async (req, res, next) => {
    try{
        const { id } = req.params;
        const folder = await Folder.findById({ _id: id, user_id: req.user.id });
        if(!folder){
            const error = new Error(`Folder with ID ${id} not found`);
            error.statusCode = 404;
            return next(error);
        }
        res.sendResponse(folder, 200);
    }catch(error){
        next(error);
    }
};

const createFolder = async (req, res, next) => {
    try{
        const { name } = req.body;
        if(!name){
            const error = new Error("Folder name is required"); 
            error.statusCode = 400;
            return next(error);
        }
        const newFolder = new Folder({ user_id: req.user.id, name });
        await newFolder.save();
        res.sendResponse(newFolder, 201);
    }catch(error){
        next(error);
    }
};

const updateFolder = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { name } = req.body;
        if(!name){
            const error = new Error("Folder name is required");
            error.statusCode = 400;
            return next(error);
        }
        const updatedFolder = await Folder.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            { name },
            { new: true }
        );
        if(!updatedFolder){
            const error = new Error(`Folder with ID ${id} not found`);
            error.statusCode = 404;
            return next(error);
        }
        res.sendResponse(updatedFolder, 200);
    }catch(error){
        next(error);
    }
};

const deleteFolder = async (req, res, next) => {
    try{
        const { id } = req.params;
        const deletedFolder = await Folder.findOneAndDelete({ _id: id, user_id: req.user.id });
        if(!deletedFolder){
            const error = new Error(`Folder with ID ${id} not found`);
            error.statusCode = 404;
            return next(error);
        }
        res.sendResponse(deletedFolder, 200);
    }catch(error){
        next(error);
    }
};

export { getNotesByFolder, getAllFolders, getFolderById, createFolder, updateFolder, deleteFolder };