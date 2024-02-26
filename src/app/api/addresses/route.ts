import { getUserSession } from '@/server/auth/auth.utils';
import { addressService } from '@/server/services';
import { createAddressSchema } from '@/shared/schemas/address.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  const json = await req.json();
  const jsonResult = await createAddressSchema.safeParseAsync(json);

  if (!jsonResult.success) return NextResponse.json(null, { status: 400 });

  const data = jsonResult.data;

  // TODO: There is a lot to check

  try {
    const newAddress = await addressService.create(user.id, data);
    return NextResponse.json(newAddress, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(null, { status: 500 });
  }
}
