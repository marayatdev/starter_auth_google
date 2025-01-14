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

  public googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
  });

  public googleAuthCallback = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate("google", { session: false, failureMessage: true }, async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        this.jwtSecret,
        { expiresIn: "1m" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });

      res.redirect("http://localhost:4000");
    })(req, res, next);
  };

  public logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.redirect("http://localhost:4000");
  };


  public checkToken = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({ message: "Token not provided" });
      }
      res.status(200).json({ message: "Token valid" });
    } catch (err) {
      res.status(401).json({ message: "Token invalid" });
    } finally {
      next();
    }
  }


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
