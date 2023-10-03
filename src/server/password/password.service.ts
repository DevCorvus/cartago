import bcrypt from 'bcrypt';

class PasswordService {
  async encrypt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async compare(password: string, encrypt: string): Promise<boolean> {
    return bcrypt.compare(password, encrypt);
  }
}

export const passwordService = new PasswordService();
