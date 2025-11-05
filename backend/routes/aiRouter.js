import express from 'express';
import { streamAIContent } from '../controllers/aiController.js';
// import generateContent from '../controllers/aiController.js';

const aiRouter= express.Router();

aiRouter.post("/stream", streamAIContent);

export default aiRouter;