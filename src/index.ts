import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import http from 'http';
import mongoose from 'mongoose';
import connectDB from './config/db';
import dotenv from 'dotenv';
import userAuthRoutes from './routes/userAuth';
import uploadController from './middlewares/uploadController';
import courseRoutes from './routes/courseroute';
dotenv.config();
const app = express();

app.use(cors({
    origin: "*", // your frontend
    credentials: true
  }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

const server = http.createServer(app);
connectDB();
server.listen(8081, () => {
    console.log('Server is running on port 8081');
});
app.use('/api/auth', userAuthRoutes);
app.use('/api/upload', uploadController);
app.use('/api/courses', courseRoutes);