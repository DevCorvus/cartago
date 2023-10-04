import { NextRequest, NextResponse } from 'next/server';
import { passwordService } from '@/server/password/password.service';
import { userService } from '@/server/user/user.service';
import { createUserSchema } from '@/shared/schemas/user.schema';
import { CreateUserDto } from '@/shared/dtos/user.dto';

// I don't like this but I had to do it this way.
export async function POST(req: NextRequest) {
  let data: CreateUserDto;

  try {
    const json = await req.json();
    data = await createUserSchema.parseAsync(json);
  } catch {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const encryptedPassword = await passwordService.encrypt(data.password);
  data.password = encryptedPassword;

  try {
    await userService.create(data);
  } catch {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 409 },
    );
  }

  return NextResponse.json(
    { message: 'User created successfully' },
    { status: 201 },
  );
}
