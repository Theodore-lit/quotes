import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const JWT_SECRET = process.env.JWT_SECRET ?? "secretjwt";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "2h";

export function googleLogin(req, res, next) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = {
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            avatar: profile.photos[0].value,
            gender: profile._json.gender,
          };
          const us = await User.findOne({ email: user.email });
          
          // 👉 Cherche l'utilisateur dans MongoDB
          let dbUser = await User.findOne({ googleId: user.googleId });

          // quand l'utilisateur qui ne s'est pas incrit avec google veut se connecter avec google
          if (us && !dbUser) {
           dbUser = await User.findOneAndUpdate(
              { email: user.email },
              { googleId: user.googleId },
              { new: true },
            );
          }

          // 👉 Crée l'utilisateur s'il n'existe pas
          if (!dbUser) {
            dbUser = await User.create(user);
          }

          // 👉 Crée le token JWT
          const token = jwt.sign(
            {
              sub: String(dbUser._id),
              email: dbUser.email,
              googleId: dbUser.googleId,
              username: dbUser.username,
              avatar: profile.photos[0].value,
              gender: profile._json.gender,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN },
          );
          // req.user = { user: dbUser, token };
          return done(null, { user: dbUser, token });
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}
