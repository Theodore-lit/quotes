import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';

import { googleLogin } from './services/google.service.js';
import apiRouter from './routes/index.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOptions = {
  origin: frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

googleLogin();

app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
