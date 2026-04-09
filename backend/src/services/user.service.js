import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
}



export const getAllUsers = async ({ page, limit, search, role }) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (role && role !== "undefined" && role !== "") {
    filter.role = role;
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 }) // <-- Corrigé : createdAt au lieu de creatAt
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .exec(), // Optionnel : améliore les perfs si tu ne modifies pas les objets après
    User.countDocuments(filter),
  ]);
  return {
    items,
    total,
  };
};

export const updateUser = async (userId, updateData) => {
  const user = findById(userId).select("+passwordHash");
  if (updateData.passwordHash && updateData.current) {
      const ok = await bcrypt.compare(updateData.current, user.passwordHash);
      if (!ok) {
        const err = new Error("Invalid credentials");
        err.statusCode = 401;
        throw err;
    }
    const salt = await bcrypt.genSalt(10);
    updateData.passwordHash = await bcrypt.hash(updateData.passwordHash, salt);
  }
  return User.findByIdAndUpdate(userId, updateData, { new: true }).select(
    "-passwordHash",
  );
};

export const deleteUser = async (userId) => {
  return User.findByIdAndUpdate(userId, { $set: { status: 'unactive' } });
};

const userService = {
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};
export default userService;
