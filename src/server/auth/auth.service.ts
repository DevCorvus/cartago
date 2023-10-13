import { LoginUserDto } from '@/shared/dtos/user.dto';
import { PasswordService } from '../password/password.service';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
  ) {}

  async login(data: LoginUserDto): Promise<User | null> {
    const user = await this.userService.findByEmail(data.email);

    if (!user) return null;

    const passwordsMatch = await this.passwordService.compare(
      data.password,
      user.password,
    );

    if (!passwordsMatch) return null;

    return user;
  }
}
