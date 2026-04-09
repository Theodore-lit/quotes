import mongoose from "mongoose";

const { Schema } = mongoose;

const likesSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User"},
    quote: { type: Schema.Types.ObjectId, ref: "Quote", default: null },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

likesSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    if (doc.quote) {
      const Quote = mongoose.model('Quote');
      
      // On retire l'ID du commentaire du tableau 'quote' du Post lié
      await Quote.findByIdAndUpdate(doc.quote, {
        $pull: { likesCount: doc._id }
      });
    }
    if (doc.comment) {
      const Comment = mongoose.model('Comment');
      
      // On retire l'ID du commentaire du tableau 'comments' du Post lié
      await Comment.findByIdAndUpdate(doc.comment, {
        $pull: { likesCount: doc._id }
      });
    }
  }
});
likesSchema.post('save', async function(doc) {
  if (doc) {
    if (doc.quote) {
      const Quote = mongoose.model('Quote');
      
      // On ajoute l'ID du commentaire du tableau 'quote' du Post lié
      await Quote.findByIdAndUpdate(doc.quote, {
        $push: { likesCount: doc._id }
      });
    }
    if (doc.comment) {
      const Comment = mongoose.model('Comment');
      
      // On ajoute l'ID du commentaire du tableau 'comments' du Post lié
      await Comment.findByIdAndUpdate(doc.comment, {
        $push: { likesCount: doc._id }
      });
    }
  }
});

export const Like = mongoose.model("Like", likesSchema);