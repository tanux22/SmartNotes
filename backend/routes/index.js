import express from 'express';
import notesRouter from './notesRouter.js';
import aiRouter from './aiRouter.js';
import userRouter from './userRouter.js';
import foldersRouter from './folderRouter.js';

const appRouter = express.Router();

appRouter.use("/notes",notesRouter);
appRouter.use("/folders", foldersRouter);
appRouter.use("/gemini-ai" , aiRouter);
appRouter.use("/user", userRouter);


export default appRouter; 