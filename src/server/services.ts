import { AuthService } from './auth/auth.service';
import { CountryService } from './country/country.service';
import { PasswordService } from './password/password.service';
import { UserService } from './user/user.service';

export const passwordService = new PasswordService();
export const countryService = new CountryService();
export const userService = new UserService(passwordService);
export const authService = new AuthService(userService, passwordService);
