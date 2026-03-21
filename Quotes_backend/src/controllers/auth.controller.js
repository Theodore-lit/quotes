import { registerUser, loginUser } from "../services/auth.service.js";

export async function login(req, res, next) {
  console.log(req.body);
  try {
    const user = await loginUser(req.body ?? {});
    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body ?? {});
    if (!user) return res.status(204).json({ message: "entrée invalid" });
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

