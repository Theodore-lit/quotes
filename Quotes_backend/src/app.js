import express from 'express';
import dotenv from 'dotenv';
import apiRouter from "./routes/index.js";
import  notFound  from './middlewares/notFound.js';
import  errorHandler  from './middlewares/errorHandler.js';
import cors from "cors";
dotenv.config()
const app = express();
app.use(cors())
app.use(express.json())
app.use("/api", apiRouter)
app.use(notFound)
app.use(errorHandler)
export default app