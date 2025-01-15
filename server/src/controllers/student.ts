// controller/authController.ts

import { NextFunction, Request, Response } from "express";
import { StudentService } from "../services/student";
import { CreateStudent } from "../models/student";

export class StudentController {
  private studentService = new StudentService();

  constructor() { }

  public createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { id, student_id, prefix, f_name, l_name, gen } = req.body;

      const response = await this.studentService.createStudent(Number(id), student_id, prefix, f_name, l_name, gen);

      res.status(201).json(response);

    } catch (error) {
      next(error);
    }
  };

  public listStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gen = req.query.gen;
      console.log(gen);

      const response = await this.studentService.listStudent(Number(gen));
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
