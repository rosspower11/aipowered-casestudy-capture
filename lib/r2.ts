import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

let cached: S3Client | null = null;

export function getR2Client(): S3Client {
  if (cached) return cached;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials are missing. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.');
  }
  cached = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cached;
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) throw new Error('R2_BUCKET is not set');
  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return key;
}

export function publicUrl(key: string) {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base) throw new Error('R2_PUBLIC_BASE_URL is not set');
  return `${base.replace(/\/$/, '')}/${key.split('/').map(encodeURIComponent).join('/')}`;
}
