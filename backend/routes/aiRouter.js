import express from 'express';
import generateContent from '../controllers/aiController.js';

const aiRouter= express.Router();

aiRouter.post("/generate", generateContent);

export default aiRouter;