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
  // 1. Récupération de l'utilisateur avec son hash actuel
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    const err = new Error("Utilisateur non trouvé");
    err.statusCode = 404;
    throw err;
  }

  // 2. Logique intelligente pour le mot de passe
  if (updateData.passwordHash) {
    
    // Cas A : L'utilisateur a déjà un mot de passe en base
    if (user.passwordHash) {
      if (!updateData.current) {
        const err = new Error("Le mot de passe actuel est requis pour cette modification");
        err.statusCode = 400;
        throw err;
      }

      const ok = await bcrypt.compare(updateData.current, user.passwordHash);
      if (!ok) {
        const err = new Error("Mot de passe actuel incorrect");
        err.statusCode = 401;
        throw err;
      }
    } 
    // Cas B : Pas de passwordHash (Utilisateur Google). 
    // On laisse passer sans vérifier 'current'.

    // Hashage du nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    updateData.passwordHash = await bcrypt.hash(updateData.passwordHash, salt);
  }

  // 3. Nettoyage des données temporaires avant l'update
  delete updateData.current;

  // 4. Mise à jour finale
  const updated = await User.findByIdAndUpdate(
    userId, 
    { $set: updateData }, // Utilisation de $set pour être précis
    { new: true, runValidators: true }
  ).select("-passwordHash");

  return updated;
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
