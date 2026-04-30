import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const user = await loginUser(req.body ?? {});
    return res.status(201).json(user);
  } catch (err) {
    if (err.statusCode === 401) return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }
}

export async function register(req, res, next) {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.avatar = req.file.filename;
    }
    const user = await registerUser(payload ?? {});
    if (!user) return res.status(204).json({ message: "entrée invalid" });
    return res.status(201).json(user);
  } catch (error) {
    if (err.statusCode === 409) {
      // Code spécifique à MongoDB pour les doublons (Email)
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Données invalides : vérifiez la taille du nom" });
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export function googleAuthCallback(req, res) {
  try {
    const { user, token } = req.user;
    // Redirige vers le frontend avec le token en query param
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(
      `${frontendUrl}/login?token=${encodeURIComponent(token)}`,
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
