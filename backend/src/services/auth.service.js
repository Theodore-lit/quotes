import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? 'secretjwt';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '2h';

export async function registerUser({ username, email, password, role, gender, bio, avatar }) {
  if (typeof username !== "string" || username.trim().length < 2) {
    const err = new Error("name must be at least 2 characters");
    err.statusCode = 400;
    throw err;
  }

  if (typeof email !== "string" || !email.includes("@")) {
    const err = new Error("email is invalid");
    err.statusCode = 400;
    throw err;
  }

  if (typeof password !== "string" || password.length < 6) {
    const err = new Error("password must be at least 6 characters");
    err.statusCode = 400;
    throw err;
  }

  if (gender !== "M" && gender !== "F"){
    const err = new Error("gender is invalid")
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    const err = new Error("email already in use");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: username.trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    gender, 
    bio,
    avatar,
  });

  return user;
}

export async function loginUser({ email, password }) {
  console.log({ email, password })
  if (typeof email !== "string" || typeof password !== "string") {
    const err = new Error("email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // IMPORTANT: select("+passwordHash") pour pouvoir comparer
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+passwordHash",
  );
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  // JWT payload minimal (évitez d'y mettre trop de données)
  const token = jwt.sign(
    { sub: String(user._id), username: user.username, email: user.email, bio: user.bio, gender: user.gender, avatar: user.avatar },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  // On renvoie un user "public" (sans passwordHash)
  // Note: user contient passwordHash en mémoire, mais toJSON le supprime.
  return {
    token,
    user: user.toJSON(),
  };
}


export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
}