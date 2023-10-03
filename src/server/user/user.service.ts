import { prisma } from '@/lib/prisma';
import { CreateUserDto } from '@/shared/dtos/user.dto';
import { User } from '@prisma/client';

class UserService {
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

  async create(data: CreateUserDto): Promise<void> {
    await prisma.user.create({ data });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}

export const userService = new UserService();
