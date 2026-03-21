import {Router} from "express"
import * as commentsController from "../controllers/comments.controller.js";

const router = Router()

router.get("/", commentsController.list);
router.post("/", commentsController.create);
router.get("/:id", commentsController.getOne);
router.patch("/:id", commentsController.update);
router.delete("/:id", commentsController.remove);


export default router