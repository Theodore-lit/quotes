import { Router } from "express";
import * as codeController from "../controllers/code.controller.js";
const router = Router();

router.post("/create", codeController.create);
router.post("/verify", codeController.verify);

export default router;
