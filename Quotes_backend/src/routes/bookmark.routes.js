import { Router } from "express";
import * as bookmarkController from "../controllers/bookmarks.controller.js";
const router = Router();

router.post("/", bookmarkController.create);
router.get("/", bookmarkController.getOne);
router.delete("/:id", bookmarkController.remove);

export default router;
