import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth";
import authenticateToken from "../middlewares/auth";
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
  }
}

export default new AuthRoutes().router;
