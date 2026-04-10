import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    googleId: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    bio: {type: String, minlength: 7},
    gender: {type: String, enum: ["M", "F"]},
    avatar: { type: String, default: "" },
    status: { type: String, enum: ["unactive", "active"], default: "active" },
  },
  { timestamps: true },
);
// Enlever passwordHash quand on fait res.json(user)
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});
export const User = mongoose.model("User", userSchema);
