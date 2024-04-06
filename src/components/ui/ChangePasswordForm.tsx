'use client';

import { useChangePassword } from '@/data/password';
import { toastError } from '@/lib/toast';
import { UpdateUserPasswordDto } from '@/shared/dtos/user.dto';
import { updateUserPasswordSchema } from '@/shared/schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

export default function ChangePasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserPasswordDto>({
    resolver: zodResolver(updateUserPasswordSchema),
  });

  const changePasswordMutation = useChangePassword();

  const onSubmit: SubmitHandler<UpdateUserPasswordDto> = async (data) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      router.push('/account');
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-sm flex-col items-center justify-center gap-10 rounded-lg border-2 border-gray-50 bg-white p-10 shadow-md"
      >
        <header className="w-full">
          <h1 className="text-2xl font-bold text-green-800">Change password</h1>
        </header>
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="oldPassword" className="text-green-800 opacity-75">
              Current password
            </label>
            <input
              {...register('oldPassword')}
              id="oldPassword"
              type="password"
              placeholder="Enter your current password"
              className="input p-4"
            />
            {errors.oldPassword && (
              <p className="text-red-400">{errors.oldPassword.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="newPassword" className="text-green-800 opacity-75">
              New password
            </label>
            <input
              {...register('newPassword')}
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              className="input p-4"
            />
            {errors.newPassword && (
              <p className="text-red-400">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label
              htmlFor="confirmNewPassword"
              className="text-green-800 opacity-75"
            >
              Confirm new password
            </label>
            <input
              {...register('confirmNewPassword')}
              id="confirmNewPassword"
              type="password"
              placeholder="Repeat new password"
              className="input p-4"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-400">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </div>
        <button type="submit" className="btn w-full p-3">
          Submit
        </button>
      </form>
    </div>
  );
}
