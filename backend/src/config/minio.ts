import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

export const MINIO_BUCKET = process.env.MINIO_BUCKET || 'myhouz';

/**
 * Initialise MinIO : vérifie que le bucket existe, sinon le crée.
 */
export const initMinio = async (): Promise<void> => {
  try {
    const exists = await minioClient.bucketExists(MINIO_BUCKET);
    if (!exists) {
      await minioClient.makeBucket(MINIO_BUCKET);
      console.log(`✅ Bucket MinIO "${MINIO_BUCKET}" créé`);

      // Politique publique en lecture pour servir les images
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`]
          }
        ]
      };
      await minioClient.setBucketPolicy(MINIO_BUCKET, JSON.stringify(policy));
      console.log(`✅ Politique de lecture publique appliquée au bucket "${MINIO_BUCKET}"`);
    } else {
      console.log(`✅ Bucket MinIO "${MINIO_BUCKET}" déjà existant`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('❌ Erreur lors de l\'initialisation de MinIO:', message);
    throw error;
  }
};

export default minioClient;
