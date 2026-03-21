import { Router } from "express";
import * as quotesController from "../controllers/quotes.controller.js";

const router = Router();

router.get("/", quotesController.list);
router.post("/", quotesController.create);
router.get("/bookMark/:id", quotesController.listMark);
router.get("/userQuotes/:id", quotesController.userQuotes);
router.get("/:id", quotesController.getOne);
router.patch("/:id", quotesController.update);
router.delete("/:id", quotesController.remove);

export default router;
