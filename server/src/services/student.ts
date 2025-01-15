
import { PrismaClient, users } from "@prisma/client";

export class StudentService {
  private prisma = new PrismaClient();


  public async createStudent(id: number, student_id: number, prefix: string, f_name: string, l_name: string, gen: number): Promise<users> {
    return await this.prisma.users.update({
      where: {
        id: id
      },
      data: {
        student_id: student_id,
        prefix: prefix,
        f_name: f_name,
        l_name: l_name,
        gen: gen
      }
    })
  }

  public async listStudent(gen: number): Promise<users[]> {
    return await this.prisma.users.findMany({
      where: {
        gen: gen
      },
      orderBy: {
        student_id: 'asc'
      }
    });
  }


}
