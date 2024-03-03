import { formatPhoneNumber } from '@/lib/phone';
import { getUserSession } from '@/server/auth/auth.utils';
import { addressService, countryService } from '@/server/services';
import { Params } from '@/shared/dtos/params.dto';
import {
  createUpdateAddressFormSchema,
  createUpdateAddressSchema,
} from '@/shared/schemas/address.schema';
import { paramsSchema } from '@/shared/schemas/params.schema';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: Params;
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  const result = await paramsSchema.safeParseAsync(params);

  if (!result.success) return NextResponse.json(null, { status: 400 });

  const addressId = result.data.id;

  try {
    const userHasAddress = await addressService.exists(addressId, user.id);

    if (!userHasAddress) return NextResponse.json(null, { status: 404 });

    await addressService.delete(addressId);
    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  const paramsResult = await paramsSchema.safeParseAsync(params);

  if (!paramsResult.success) return NextResponse.json(null, { status: 400 });

  const json = await req.json();
  const jsonResult = await createUpdateAddressFormSchema.safeParseAsync(json);

  if (!jsonResult.success) return NextResponse.json(null, { status: 400 });

  const addressId = paramsResult.data.id;
  const data = jsonResult.data;

  try {
    const userHasAddress = await addressService.exists(addressId, user.id);

    if (!userHasAddress) return NextResponse.json(null, { status: 404 });

    const stateExists = await countryService.stateExists(data.stateId);

    if (!stateExists) return NextResponse.json(null, { status: 400 });

    data.phoneNumber = formatPhoneNumber(
      data.phoneNumber,
      data.phoneCountryCode,
    );

    const refinedData = await createUpdateAddressSchema.parseAsync(data);

    const updatedAddress = await addressService.update(
      addressId,
      user.id,
      refinedData,
    );
    return NextResponse.json(updatedAddress, { status: 200 });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
