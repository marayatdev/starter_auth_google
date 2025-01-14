import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth";
import { authMiddleware } from "../middlewares/authMiddleware";
export class AuthRoutes {
  public router: Router = Router();

  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/google`, this.authController.googleAuth);
    this.router.get(`/google/callback`, this.authController.googleAuthCallback);
    this.router.get(`/logout`, this.authController.logout);
    this.router.get(`/check`, this.authController.checkToken);
    this.router.get(`/me`, authMiddleware, this.authController.getUserMe);
  }
}

export default new AuthRoutes().router;
