import { formatPhoneNumber } from '@/lib/phone';
import { getUserSession } from '@/server/auth/auth.utils';
import { addressService, countryService } from '@/server/services';
import {
  createAddressFormSchema,
  createAddressSchema,
} from '@/shared/schemas/address.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  try {
    const addresses = await addressService.findAll(user.id);
    return NextResponse.json(addresses, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  const json = await req.json();
  const jsonResult = await createAddressFormSchema.safeParseAsync(json);

  if (!jsonResult.success) return NextResponse.json(null, { status: 400 });

  const data = jsonResult.data;

  try {
    const stateExists = await countryService.stateExists(data.stateId);

    if (!stateExists) return NextResponse.json(null, { status: 400 });

    data.phoneNumber = formatPhoneNumber(
      data.phoneNumber,
      data.phoneCountryCode,
    );

    const refinedData = await createAddressSchema.parseAsync(data);

    const newAddress = await addressService.create(user.id, refinedData);
    return NextResponse.json(newAddress, { status: 201 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
