import { UpdateUserPasswordDto } from '@/shared/dtos/user.dto';
import { useMutation } from '@tanstack/react-query';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: UpdateUserPasswordDto) => {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Could not change user password');
      }
    },
  });
};
