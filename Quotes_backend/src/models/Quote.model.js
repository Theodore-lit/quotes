import mongoose from "mongoose";
import { Comment } from "./Comment.model.js";
import {Like} from "./Like.model.js"
import { Bookmark } from './Bookmark.model.js'


const { Schema } = mongoose;

const quotesSchema = new Schema(
  {
    image: { type: String, minlength: 5 },
    text: { type: String, required: true, minlength: 10 },
    tags: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    commentsCount: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    likesCount: [{type: Schema.Types.ObjectId, ref: "Like"}],
    bookmarksCount: [{type: Schema.Types.ObjectId, ref: "Bookmark"}]
  },
  { timestamps: true }
);

quotesSchema.pre('findOneAndDelete', async function(next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    // Supprime tous les commentaires dont l'ID est présent dans le tableau 'comments' du post
    await mongoose.model('Comment').deleteMany({
      _id: { $in: doc.commentsCount }
    });
    await mongoose.model('Like').deleteMany({
      _id: { $in: doc.likesCount }
    });
    await mongoose.model('Bookmark').deleteMany({
      _id: { $in: doc.bookmark }
    });
  }
  // next();
});

export const Quote = mongoose.model("Quote", quotesSchema);