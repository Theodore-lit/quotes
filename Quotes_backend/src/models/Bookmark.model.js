import mongoose from "mongoose";
import {Quote} from './Quote.model.js'

const { Schema } = mongoose;

const bookmarkSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User"},
    quote: { type: Schema.Types.ObjectId, ref: "Quote", required: true },
  },
  { timestamps: true }
);

bookmarkSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Quote = mongoose.model('Quote');
    
    // On retire l'ID du commentaire du tableau 'comments' du Post lié
    await Quote.findByIdAndUpdate(doc.quote, {
      $pull: { bookmarksCount: doc._id }
    });
  }
});
bookmarkSchema.post('save', async function(doc) {
  if (doc) {
    const Quote = mongoose.model('Quote');
    
    // On retire l'ID du commentaire du tableau 'comments' du Post lié
    await Quote.findByIdAndUpdate(doc.quote, {
      $push: { bookmarksCount: doc._id }
    });
  }
});

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);