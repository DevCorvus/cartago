import { prisma } from '@/lib/prisma';
import { CreateUserDto } from '@/shared/dtos/user.dto';
import { User } from '@prisma/client';
import { PasswordService } from '../password/password.service';
import { CartService } from '../cart/cart.service';

export class UserService {
  constructor(
    private passwordService: PasswordService,
    private cartService: CartService,
  ) {}

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

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        fullname: data.fullname,
        password: data.password,
        countryId: data.location,
      },
    });

    await this.cartService.create(newUser.id);

    return newUser;
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

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
