'use client';

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

  // TODO: Handle error
  const onSubmit: SubmitHandler<UpdateUserPasswordDto> = async (data) => {
    const res = await fetch('/api/auth/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/account');
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-center flex-col gap-10 max-w-sm"
      >
        <header className="w-full">
          <h1 className="text-2xl font-bold text-green-800">Change password</h1>
        </header>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-center flex-col gap-2">
            <label htmlFor="oldPassword" className="text-green-800 opacity-75">
              Current password
            </label>
            <input
              {...register('oldPassword')}
              id="oldPassword"
              type="password"
              placeholder="Enter your current password"
              className="rounded-lg p-4 outline-none shadow-md"
            />
            {errors.oldPassword && (
              <p className="text-red-400">{errors.oldPassword.message}</p>
            )}
          </div>
          <div className="flex justify-center flex-col gap-2">
            <label htmlFor="newPassword" className="text-green-800 opacity-75">
              New password
            </label>
            <input
              {...register('newPassword')}
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              className="rounded-lg p-4 outline-none shadow-md"
            />
            {errors.newPassword && (
              <p className="text-red-400">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="flex justify-center flex-col gap-2">
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
              className="rounded-lg p-4 outline-none shadow-md"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-400">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-800 p-3 w-full rounded-3xl text-slate-50 shadow-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
