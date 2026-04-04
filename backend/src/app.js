import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Importations de tes fichiers
import apiRouter from "./routes/index.js";
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import upload from './middlewares/multerConfig.js'; // Chemin relatif sécurisé

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Rend le dossier "uploads" accessible publiquement via l'URL /uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;