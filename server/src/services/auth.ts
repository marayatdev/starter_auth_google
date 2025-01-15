// services/auth.ts

import { PrismaClient, users } from "@prisma/client";

export class AuthService {
  private prisma = new PrismaClient();

  // Find or create a user based on Google profile
  public async findOrCreateUser(googleProfile: any): Promise<users> {
    const { id, displayName, emails, photos } = googleProfile;

    const email = emails[0]?.value;

    if (!email) {
      throw new Error("Email not available in Google profile");
    }

    // Check if the user exists in the database
    let user = await this.prisma.users.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await this.prisma.users.create({
        data: {
          googleId: id,
          name: displayName,
          email,
          profilePicture: photos[0]?.value,
          updatedAt: new Date(),
        },
      });
    }

    return user;
  }

  public async findUserById(id: number): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }


}
