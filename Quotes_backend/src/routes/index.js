import { Router } from "express";
import authRouter from "./auth.routes.js";
import quoteRouter from "./quote.routes.js";
import commentRouter from "./comment.routes.js";
import likeRouter from "./like.routes.js";
import bookmarkRouter from "./bookmark.routes.js";
const router = Router();
router.use("/auth", authRouter);
router.use("/quotes", quoteRouter);
router.use("/comments", commentRouter);
router.use("/likes", likeRouter);
router.use("/bookmarks", bookmarkRouter);

export default router;
