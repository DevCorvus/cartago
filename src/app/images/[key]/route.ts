import { storageService } from '@/server/services';
import { ACCEPTED_IMAGE_MIME_TYPES } from '@/shared/schemas/product.schema';
import { NextRequest, NextResponse } from 'next/server';
import { extname } from 'path';
import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ACCEPTED_IMAGE_MIME_TYPES.map(
  (mime) => mime.split('/')[1],
);

const imageKeyParamsSchema = z.object({
  key: z
    .string()
    .refine((key) => ACCEPTED_IMAGE_TYPES.some((type) => key.endsWith(type))),
});

type ImageKeyParams = z.infer<typeof imageKeyParamsSchema>;

interface Props {
  params: ImageKeyParams;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const result = await imageKeyParamsSchema.safeParseAsync(params);

  if (!result.success) return NextResponse.json(null, { status: 400 });

  const key = result.data.key;

  try {
    const imageBuffer = await storageService.getFile(key);

    if (!imageBuffer) return NextResponse.json(null, { status: 404 });

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': `image/${extname(key).replace('.', '')}`,
      },
    });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
