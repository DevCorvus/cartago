import { categoryService } from '@/server/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const title = searchParams.get('title');

  try {
    if (title) {
      const categoryTags = await categoryService.findAllTags(
        title.trim().toLowerCase(),
      );
      return NextResponse.json(categoryTags, { status: 200 });
    } else {
      const categoryTags = await categoryService.findAllTags();
      return NextResponse.json(categoryTags, { status: 200 });
    }
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
