import { Comment } from "../models/Comment.model.js";

export async function createComment(payload) {
  return Comment.create(payload);
}

export async function getCommentById(id) {
  return Comment.findOne({_id: id}).populate("author quote")
}

export async function updateCommentById(id, payload) {
  return Comment.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
}

export async function deleteCommentById(id) {
  return Comment.findByIdAndDelete(id);
}

export async function listComments({ page = 1, limit = 5, quoteId}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 50);

  const items = await Promise.all([
    Comment.find({quote: quoteId})
      .sort({ creatAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .populate("user quote"),
  ]);

  return {
    items, meta: {
        page: safePage, limit: safeLimit
    }
  }
}