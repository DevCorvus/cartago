import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/shared/schemas/user.schema';
import { CreateUserDto } from '@/shared/dtos/user.dto';
import { countryService, userService } from '@/server/services';

export async function POST(req: NextRequest) {
  const json = await req.json();
  const result = await createUserSchema.safeParseAsync(json);

  if (!result.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const data: CreateUserDto = result.data;

  const countryExists = await countryService.exists(data.location);
  if (!countryExists) {
    return NextResponse.json({ message: 'Country not found' }, { status: 404 });
  }

  try {
    await userService.create(data);

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 409 },
    );
  }
}
