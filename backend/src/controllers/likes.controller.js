import mongoose from "mongoose";
import { createLike, deleteLikeById, getByUserId, commentLikeByUser } from "../services/likes.service.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function create(req, res, next) {
  try {
    const like = await createLike(req.body);
    const io = req.app.get("socketio");
    io.emit("like_quote_created", like);
    return res.status(201).json({ data: like });
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: { message: "Invalid id" } });
    }

    const deleted = await deleteLikeById(id);
    if (!deleted)
      return res.status(404).json({ error: { message: "Article not found" } });
    const io = req.app.get("socketio");
    io.emit("like_quote_deleted", deleted._id);
    return res.status(204).json({ message: "ok" });
  } catch (err) {
    return next(err);
  }
}


export async function getOne(req, res, next){
   try {
    const  userId  = req.query.userId;
    const  quoteId  = req.query.quoteId;
    if (!isValidObjectId(userId) || !isValidObjectId(quoteId)) {
      return res.status(400).json({ error: { message: "Invalid id" } });
    }
    const like = await getByUserId(userId, quoteId);
    return res.status(200).json(like);
  } catch (err) {
    return next(err);
  }
}




export async function getCommentLike(req, res, next){
   try {
    const  userId  = req.query.userId;
    const  commentId  = req.query.commentId;
    if (!isValidObjectId(userId) || !isValidObjectId(commentId)) {
      return res.status(400).json({ error: { message: "Invalid id" } });
    }
    const like = await commentLikeByUser(userId, commentId);
    return res.status(200).json(like);
  } catch (err) {
    return next(err);
  }

}
export async function commentLike(req, res, next){
  try {
    const like = await createLike(req.body);
    const io = req.app.get("socketio");
    io.emit("like_comment_created", like);
    return res.status(201).json({data :like});
  } catch (error) {
    return next(error);
  }

}
export async function commentUnLike(req, res, next){
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: { message: "Invalid id" } });
    }
    const deleted = await deleteLikeById(id);
    if (!deleted)
      return res.status(404).json({ error: { message: "Article not found" } });
    const io = req.app.get("socketio");
    io.emit("like_comment_deleted", deleted._id);
    return res.status(204).json({ message: "ok" });
  } catch (err) {
    return next(err);
  }
}