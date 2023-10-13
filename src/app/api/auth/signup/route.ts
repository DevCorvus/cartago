import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/shared/schemas/user.schema';
import { CreateUserDto } from '@/shared/dtos/user.dto';
import { userService } from '@/server/services';

// I don't like this but I had to do it this way.
export async function POST(req: NextRequest) {
  let data: CreateUserDto;

  try {
    const json = await req.json();
    data = await createUserSchema.parseAsync(json);
  } catch {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

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
