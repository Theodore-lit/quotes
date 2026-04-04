import mongoose from "mongoose";
import { verifyCode, createCode } from "../services/code.service.js";

export async function create(req, res, next) {
  try {
    const code = await createCode(req.body);
    return res.status(201).json({ data: code });
  } catch (error) {
    return next(error);
  }
}

export async function verify(req, res, next) {
  try {
    const record = await verifyCode(req.body);
    if (!record) throw new Error("Aucune demande");
    if (record.code != req.body.code) throw new Error("Code invalide");

    if (record.expiresAt < Date.now()) throw new Error("Code expiré");
    return res.status(200).json(record);
  } catch (err) {
    return next(err);
  }
}
