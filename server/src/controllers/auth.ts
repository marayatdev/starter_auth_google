// controller/authController.ts

import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { AuthService } from "../services/auth";
import jwt from "jsonwebtoken";

export class AuthController {
  private authService = new AuthService();
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "default_secret";
  }

  // Redirect user to Google login
  public googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
  });

  // Handle the callback from Google
  public googleAuthCallback = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate("google", { session: false }, async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        this.jwtSecret,
        { expiresIn: "1h" }
      );

      res.json({ message: "Authentication successful", token });
    })(req, res, next);
  };

  // Endpoint to verify JWT (example)
  public verifyToken = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret);
      res.json({ message: "Token valid", payload });
    } catch (err) {
      res.status(401).json({ message: "Token invalid" });
    }
  };
}
