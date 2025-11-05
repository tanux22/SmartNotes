import dotenv from 'dotenv';
dotenv.config();  

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import connectDB from './config/db.js';
import { responseHandler } from './middlewares/responseHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { redisRateLimiter } from './middlewares/rateLimiter.js';
import createAdminUser from './scripts/seedAdmin.js';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const app = express();
app.use(cors(
  {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
));
app.use(express.json({limit: '10mb'}));
app.use(morgan('dev'));

connectDB();

// app.use(redisRateLimiter(100, 10));

app.use(responseHandler);

createAdminUser();

app.use("/api", appRouter);

app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);



app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})