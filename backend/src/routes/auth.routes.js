import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import  passport  from 'passport';
const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profil/:id", authController.getProfile);
router.get("/google/callback", passport.authenticate("google", {session: false, failureRedirect: "/login" }), authController.googleAuthCallback);

export default router
