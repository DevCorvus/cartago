import { getUserSession } from '@/server/auth/auth.utils';
import { countryService } from '@/server/services';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserSession();

  if (!user) return NextResponse.json(null, { status: 401 });

  try {
    const countries = await countryService.findAll();
    return NextResponse.json(countries);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
