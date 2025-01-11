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
    // this.router.post(`/register`, this.authController.register);
    // this.router.post(`/login`, this.authController.login);
    // this.router.post(
    //   `/refresh-token`,
    //   authenticateToken,
    //   this.authController.refreshAccessToken
    // );
    // this.router.get(`/me`, authenticateToken, this.authController.getUserMe);
    // this.router.post(
    //   `/google-signin`,
    //   authenticateToken,
    //   this.authController.googleSignIn
    // );
  }
}

export default new AuthRoutes().router;
