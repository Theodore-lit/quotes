import mongoose from "mongoose";
import { createBookmark, deleteBookmarkById, getByUserId } from "../services/bookmarks.service.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function create(req, res, next) {
  try {
    const mark = await createBookmark(req.body);
    console.log(mark)
    return res.status(201).json(mark);
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

    const deleted = await deleteBookmarkById(id);
    console.log(deleted)
    if (!deleted)
      return res.status(404).json({ error: { message: "Article not found" } });
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
    const bookmark = await getByUserId(userId, quoteId);
    return res.status(200).json(bookmark);
  } catch (err) {
    return next(err);
  }
}