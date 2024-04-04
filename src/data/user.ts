import { CreateUserDto } from '@/shared/dtos/user.dto';
import { useMutation } from '@tanstack/react-query';

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
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
    },
    mutationKey: ['createUser'],
  });
};
