import { AuthService } from './auth/auth.service';
import { PasswordService } from './password/password.service';
import { UserService } from './user/user.service';

export const passwordService = new PasswordService();
export const userService = new UserService(passwordService);
export const authService = new AuthService(userService, passwordService);
