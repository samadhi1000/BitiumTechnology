import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'bitiumcatalogs';

let s3Client: S3Client | null = null;

// Initialize S3 client only if Cloudflare credentials are fully provided
if (accountId && accessKeyId && secretAccessKey) {
  s3Client = new S3Client({
    region: 'auto', // Cloudflare R2 requires region to be set to 'auto'
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
} else {
  console.warn(
    'Cloudflare R2 environment variables are missing. Please configure CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, and CLOUDFLARE_R2_SECRET_ACCESS_KEY in your env setup.'
  );
}

/**
 * Generates a temporary secure presigned download link for an asset in Cloudflare R2.
 * @param fileKey The storage path/key of the asset in the R2 bucket.
 * @param expiresSeconds Expiry time of the download link. Defaults to 900 seconds (15 minutes).
 */
export async function getSecureR2DownloadUrl(
  fileKey: string,
  expiresSeconds = 900
): Promise<string> {
  if (!s3Client) {
    // Fallback if R2 credentials are not set up yet
    console.warn(`R2 not configured. Providing fallback download link for: ${fileKey}`);
    return `https://placeholder-r2-storage.local/${fileKey}?token=mock-r2-token`;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresSeconds,
    });

    return signedUrl;
  } catch (error) {
    console.error('Error generating Cloudflare R2 signed URL:', error);
    throw new Error('Failed to generate secure download link from Cloudflare R2.');
  }
}
export default getSecureR2DownloadUrl;
