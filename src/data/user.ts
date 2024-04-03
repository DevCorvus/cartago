import { CreateUserDto } from '@/shared/dtos/user.dto';

export const createUser = async (data: CreateUserDto) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Could not create user');
  }
};
