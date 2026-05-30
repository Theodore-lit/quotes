import { Router } from "express";
import * as likesController from "../controllers/likes.controller.js";
const router = Router();

router.post("/", likesController.create);
router.get("/", likesController.getOne);
router.get("/comment", likesController.getCommentLike);
router.post("/comment", likesController.commentLike);
router.delete("/comment/:id", likesController.commentUnLike);
router.delete("/:id", likesController.remove);

export default router;
