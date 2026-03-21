import mongoose from "mongoose";
import {Quote} from './Quote.model.js'

const { Schema } = mongoose;

const commentsSchema = new Schema(
  {
    text: { type: String, required: true, minlength: 10 },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User"},
    quote: { type: Schema.Types.ObjectId, ref: "Quote", required: true },
  },
  { timestamps: true }
);

commentsSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Quote = mongoose.model('Quote');
    
    // On retire l'ID du commentaire du tableau 'comments' du Post lié
    await Quote.findByIdAndUpdate(doc.quote, {
      $pull: { commentsCount: doc._id }
    });
  }
});
commentsSchema.post('save', async function(doc) {
  if (doc) {
    const Quote = mongoose.model('Quote');
    
    // On retire l'ID du commentaire du tableau 'comments' du Post lié
    await Quote.findByIdAndUpdate(doc.quote, {
      $push: { commentsCount: doc._id }
    });
  }
});

export const Comment = mongoose.model("Comment", commentsSchema);