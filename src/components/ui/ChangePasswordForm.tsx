'use client';

import { useChangePassword } from '@/data/password';
import { toastError } from '@/lib/toast';
import { UpdateUserPasswordDto } from '@/shared/dtos/user.dto';
import { updateUserPasswordSchema } from '@/shared/schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useClickOutside } from '@/hooks/useClickOutside';
import SubmitButton from './SubmitButton';

export default function ChangePasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const ref = useClickOutside<HTMLFormElement>(close);

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm space-y-6 rounded-lg border-2 border-slate-100 bg-white p-6 shadow-md"
    >
      <header>
        <h1 className="text-xl font-bold text-cyan-700">Change password</h1>
      </header>
      <div className="flex w-full flex-col gap-6">
        <div className="space-y-2">
          <label htmlFor="oldPassword" className="text-slate-500">
            Current password
          </label>
          <input
            {...register('oldPassword')}
            id="oldPassword"
            type="password"
            placeholder="Enter your current password"
            className="input p-3"
            autoFocus
          />
          {errors.oldPassword && (
            <p className="text-red-400">{errors.oldPassword.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-slate-500">
            New password
          </label>
          <input
            {...register('newPassword')}
            id="newPassword"
            type="password"
            placeholder="Enter your new password"
            className="input p-3"
          />
          {errors.newPassword && (
            <p className="text-red-400">{errors.newPassword.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmNewPassword" className="text-slate-500">
            Confirm new password
          </label>
          <input
            {...register('confirmNewPassword')}
            id="confirmNewPassword"
            type="password"
            placeholder="Repeat new password"
            className="input p-3"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-400">{errors.confirmNewPassword.message}</p>
          )}
        </div>
      </div>
      <div>
        <SubmitButton
          className="w-full p-3"
          disabled={isSubmitting}
          placeholder="Updating"
        >
          Update
        </SubmitButton>
      </div>
    </form>
  );
}
