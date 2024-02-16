import { prisma } from '@/lib/prisma';
import { CreateUserDto, UserProfileDto } from '@/shared/dtos/user.dto';
import { User } from '@prisma/client';
import { PasswordService } from '../password/password.service';

export class UserService {
  constructor(private passwordService: PasswordService) {}

  async find(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { id } });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  }

  async create(data: CreateUserDto): Promise<User> {
    const encryptedPassword = await this.passwordService.encrypt(data.password);
    data.password = encryptedPassword;

    return prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          fullname: data.fullname,
          password: data.password,
          countryId: data.location,
        },
      });

      await tx.cart.create({ data: { userId: newUser.id } });

      return newUser;
    });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const encryptedPassword = await this.passwordService.encrypt(newPassword);

    await prisma.user.update({
      where: { id },
      data: {
        password: encryptedPassword,
      },
    });
  }

  async checkPassword(id: string, password: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { password: true },
    });

    if (!user) return false;

    return this.passwordService.compare(password, user.password);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async getProfile(id: string): Promise<UserProfileDto | null> {
    const userInfo = await prisma.user.findUnique({
      where: { id },
      select: {
        fullname: true,
        email: true,
        role: true,
        country: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userInfo) return null;

    return {
      fullname: userInfo.fullname,
      email: userInfo.email,
      role: userInfo.role,
      country: userInfo.country.name,
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,
    };
  }
}
