// services/auth.ts

import { PrismaClient, User } from "@prisma/client";

export class AuthService {
  private prisma = new PrismaClient();

  // Find or create a user based on Google profile
  public async findOrCreateUser(googleProfile: any): Promise<User> {
    const { id, displayName, emails, photos } = googleProfile;

    const email = emails[0]?.value;

    if (!email) {
      throw new Error("Email not available in Google profile");
    }

    // Check if the user exists in the database
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          googleId: id,
          name: displayName,
          email,
          profilePicture: photos[0]?.value,
        },
      });
    }

    return user;
  }

  public async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  public async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
