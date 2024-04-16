import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
