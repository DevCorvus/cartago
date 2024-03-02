import { formatPhoneNumber } from '@/lib/phone';
import { getUserSession } from '@/server/auth/auth.utils';
import { addressService, countryService } from '@/server/services';
import {
  createAddressFormSchema,
  createAddressSchema,
} from '@/shared/schemas/address.schema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const searchParamsSchema = z.object({
  minimal: z
    .string()
    .toLowerCase()
    .transform((x) => x === 'true')
    .pipe(z.boolean())
    .nullable(),
});

export async function GET(req: NextRequest) {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  const searchParams = req.nextUrl.searchParams;

  const searchParamsResult = await searchParamsSchema.safeParseAsync({
    minimal: searchParams.get('minimal'),
  });

  if (!searchParamsResult.success)
    return NextResponse.json(null, { status: 400 });

  const minimal = searchParamsResult.data.minimal;

  try {
    if (minimal) {
      const addresses = await addressService.findAllMinimal(user.id);
      return NextResponse.json(addresses, { status: 200 });
    } else {
      const addresses = await addressService.findAll(user.id);
      return NextResponse.json(addresses, { status: 200 });
    }
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
