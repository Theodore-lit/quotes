import { Quote } from "../models/Quote.model.js";
import { Bookmark } from "../models/Bookmark.model.js";

export async function createQuote(payload) {
  return Quote.create(payload);
}

export async function getQuoteById(id) {
  return Quote.findOne({ _id: id }).populate(
    "author commentsCount likesCount bookmarksCount",
  );
}

export async function updateQuoteById(id, payload) {
  return Quote.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
}

export async function deleteQuoteById(id) {
  return Quote.findByIdAndDelete(id);
}

// export async function listQuotes({ page = 1, limit = 10, search, tags }) {
//   const safePage = Math.max(Number(page) || 1, 1);
//   const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

//   const filter = {};
//   if (search) {
//     // recherche simple sur title (regex)
//     filter.text = { $regex: search, $options: "i" };
//   }

//   if (tags){
//     filter.tags = { $regex: tags, $options: "i"}
//   }

//   const [items, total] = await Promise.all([
//     Quote.find(filter)
//       .sort({ creatAt: -1 })
//       .skip((safePage - 1) * safeLimit)
//       .limit(safeLimit)
//       .populate("author commentsCount likesCount"),
//     Quote.countDocuments(filter),
//   ]);

//   return {
//     items, meta: {
//         page: safePage, limit: safeLimit, total
//     }
//   }
// }

export async function listTags() {
  return Quote.distinct("tags");
}

export async function listQuotes({ page = 1, limit = 10, search, tags }) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const filter = {};
  if (search) {
    filter.text = { $regex: search, $options: "i" };
  }
  if (tags && tags.length > 0) {
    // Si tags est un tableau dans ta DB, MongoDB filtrera si 'tags' est présent dedans
    filter.tags = { $in: tags};
  }


  const [items, total] = await Promise.all([
    Quote.find(filter)
      .sort({ createdAt: -1 }) // <-- Corrigé : createdAt au lieu de creatAt
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .populate("author")
      .populate("likesCount")
      .populate("bookmarksCount")
      .exec(), // Optionnel : améliore les perfs si tu ne modifies pas les objets après
    Quote.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
    },
  };
}
export async function listBookmark(id) {
  // 1. On trouve les IDs dans la table de référence
  try {
    const bookmarks = await Bookmark.find({ user: id }).select("quote").lean();
    const quoteIds = bookmarks.map((b) => b.quote);

    // 2. On filtre le modèle principal avec ces IDs
    const results = await Quote.find({ _id: { $in: quoteIds } })
      .populate("author")
      .sort({ createdAt: -1 });

    return results;
  } catch (error) {
  }
}

export async function quotesUser(id) {
  try {
    const quotes = await Quote.find({ author: id })
      .sort({ createdAt: -1 })
      .populate("author")
      .populate("likesCount")
      .populate("bookmarksCount");
    return quotes;
  } catch (error) {
  }
}
