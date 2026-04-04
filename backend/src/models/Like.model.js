import mongoose from "mongoose";
import {Quote} from './Quote.model.js'

const { Schema } = mongoose;

const likesSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User"},
    quote: { type: Schema.Types.ObjectId, ref: "Quote", required: true },
  },
  { timestamps: true }
);

likesSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Quote = mongoose.model('Quote');
    
    // On retire l'ID du commentaire du tableau 'comments' du Post lié
    await Quote.findByIdAndUpdate(doc.quote, {
      $pull: { likesCount: doc._id }
    });
  }
});
likesSchema.post('save', async function(doc) {
  if (doc) {
    const Quote = mongoose.model('Quote');
    
    // On retire l'ID du commentaire du tableau 'comments' du Post lié
    await Quote.findByIdAndUpdate(doc.quote, {
      $push: { likesCount: doc._id }
    });
  }
});

export const Like = mongoose.model("Like", likesSchema);