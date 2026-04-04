import mongoose from "mongoose";

const { Schema } = mongoose;

const codeSchema = new Schema(
  {
    email: { type: String,
      required: true,
      trim: true,
      lowercase: true,},
    code: { type: Number, trim: true, required: true },
    expiresAt: {
      type: Date,
      expires: 600 // 10 min
    }
  }
);


export const Code = mongoose.model("Code", codeSchema);