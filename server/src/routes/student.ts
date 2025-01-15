import { Router, Request, Response } from "express";
import { StudentController } from "../controllers/student";
export class StudentRoutes {
  public router: Router = Router();

  public studentController = new StudentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`/create`, this.studentController.createStudent);
    this.router.get(`/list`, this.studentController.listStudent);

  }
}

export default new StudentRoutes().router;
