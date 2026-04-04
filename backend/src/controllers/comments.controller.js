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
    console.log(req.query);
    const comments = await listComments({page: req.query.page, limit:req.query.limit, quoteId: req.query.quoteId});
    return res.status(200).json(comments);
  } catch (error) {
    return next(error);
  }
}

export async function create(req, res, next) {
  try {
    console.log((req.body));
    const article = await createComment(req.body);
    return res.status(201).json({ data: article });
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
    const article = await getCommentById(id);
    if (!article) {
      return res.status(404).json({
        error: {
          message: "Article not Found",
        },
      });
    }
    res.status(200).json({ data: article });
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

    const article = await updateCommentById(id, req.body);
    if (!article)
      return res.status(404).json({ error: { message: "Article not found" } });
    return res.status(200).json({ data: article });
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
    return res.status(204).json({ message: "ok" });
  } catch (err) {
    return next(err);
  }
}
