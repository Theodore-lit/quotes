import mongoose from "mongoose";
import {
  createQuote,
  deleteQuoteById,
  getQuoteById,
  listQuotes,
  updateQuoteById,
  listBookmark,
  quotesUser,
} from "../services/quotes.service.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function list(req, res, next) {
  try {
    const quotes = await listQuotes({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      tags: req.query.tags,
    });
    return res.status(200).json({ data: quotes.items, allTags: quotes.allTags });
  } catch (error) {
    return next(error);
  }
}
export async function listMark(req, res, next) {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: "Invalid id",
        },
      });
    }
    const quotes = await listBookmark(id);
    return res.status(200).json(quotes);
  } catch (error) {
    return next(error);
  }
}

export async function userQuotes(req, res, next){
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          message: "Invalid id",
        },
      });
    }
    const quotes = await quotesUser(id);
    return res.status(200).json(quotes);
  } catch (error) {
    return next(error);
  }
}

export async function create(req, res, next) {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.image = req.file.filename;
    }
    if (payload.tags && typeof payload.tags === "string") {
      payload.tags = payload.tags.split(",").filter((t) => t.trim());
    }
    const article = await createQuote(payload);
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
    const article = await getQuoteById(id);
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

    const payload = { ...req.body };
    if (req.file) {
      payload.image = req.file.filename;
    }
    if (payload.tags && typeof payload.tags === "string") {
      payload.tags = payload.tags.split(",").filter((t) => t.trim());
    }

    const article = await updateQuoteById(id, payload);
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

    const deleted = await deleteQuoteById(id);
    if (!deleted)
      return res.status(404).json({ error: { message: "Article not found" } });
    return res.status(204).json({ message: "ok" });
  } catch (err) {
    return next(err);
  }
}

