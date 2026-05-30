import mongoose from "mongoose";
import {
  createComment,
  deleteCommentById,
  getCommentById,
  listComments,
  updateCommentById,
} from "../services/comments.service.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function list(req, res, next) {
  try {
    const comments = await listComments({page: req.query.page, limit:req.query.limit, quoteId: req.query.quoteId});
    return res.status(200).json(comments);
  } catch (error) {
    return next(error);
  }
}

export async function create(req, res, next) {
  try {
    const comment = await createComment(req.body);
    const populateComment =  await getCommentById(comment._id);
    const io = req.app.get("socketio");
    io.emit("comment_created", populateComment);
    return res.status(201).json({ data: populateComment });
  } catch (error) {
    return next(error);
  }
}

export async function getOne(req, res, next) {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: "Invalid id",
        },
      });
    }
    const comment = await getCommentById(id);
    if (!comment) {
      return res.status(404).json({
        error: {
          message: "comment not Found",
        },
      });
    }
    res.status(200).json({ data: comment });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: { message: "Invalid id" } });
    }

    const comment = await updateCommentById(id, req.body);
    if (!comment)
      return res.status(404).json({ error: { message: "Article not found" } });
    const io = req.app.get("socketio");
    io.emit("comment_updated", comment._id);
    return res.status(200).json({ data: comment });
  } catch (err) {
    return next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: { message: "Invalid id" } });
    }

    const deleted = await deleteCommentById(id);
    if (!deleted)
      return res.status(404).json({ error: { message: "Article not found" } });
    const io = req.app.get("socketio");
    io.emit("comment_deleted", deleted._id);
    return res.status(204).json({ message: "ok" });
  } catch (err) {
    return next(err);
  }
}
