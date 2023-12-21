import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart.service';
import { CategoryService } from './category/category.service';
import { CountryService } from './country/country.service';
import { PasswordService } from './password/password.service';
import { ProductService } from './product/product.service';
import { UserService } from './user/user.service';

export const passwordService = new PasswordService();
export const countryService = new CountryService();
export const cartService = new CartService();
export const userService = new UserService(passwordService, cartService);
export const authService = new AuthService(userService, passwordService);
export const productService = new ProductService();
export const categoryService = new CategoryService();
