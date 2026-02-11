import path from 'path';
import crypto from 'crypto';
import minioClient, { MINIO_BUCKET } from '../config/minio';

/**
 * Génère l'URL publique d'un objet MinIO.
 * Utilise MINIO_PUBLIC_URL si défini (pour la production), sinon construit l'URL.
 */
function getPublicUrl(objectName: string): string {
  const publicUrl = process.env.MINIO_PUBLIC_URL;
  if (publicUrl) {
    return `${publicUrl}/${MINIO_BUCKET}/${objectName}`;
  }
  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  const port = process.env.MINIO_PORT || '9000';
  const portSuffix = (protocol === 'https' && port === '443') || (protocol === 'http' && port === '80') ? '' : `:${port}`;
  return `${protocol}://${endpoint}${portSuffix}/${MINIO_BUCKET}/${objectName}`;
}

/**
 * Détermine le sous-dossier dans le bucket à partir du type d'entité.
 */
function getFolderForEntity(entity: string): string {
  switch (entity) {
    case 'projects':
      return 'projects';
    case 'products':
      return 'products';
    case 'profiles':
      return 'profiles';
    case 'ideabooks':
      return 'ideabooks';
    case 'reviews':
      return 'reviews';
    case 'articles':
      return 'articles';
    default:
      return 'misc';
  }
}

export interface UploadResult {
  url: string;
  objectName: string;
  size: number;
  mimetype: string;
}

/**
 * Upload un fichier vers MinIO.
 *
 * @param file - Fichier Multer (memoryStorage)
 * @param entity - Type d'entité (projects, products, profiles, etc.)
 * @returns Informations sur le fichier uploadé
 */
export async function uploadFile(
  file: Express.Multer.File,
  entity: string
): Promise<UploadResult> {
  const folder = getFolderForEntity(entity);
  const uniqueId = crypto.randomUUID();
  const extension = path.extname(file.originalname);
  const objectName = `${folder}/${uniqueId}${extension}`;

  await minioClient.putObject(MINIO_BUCKET, objectName, file.buffer, file.size, {
    'Content-Type': file.mimetype
  });

  return {
    url: getPublicUrl(objectName),
    objectName,
    size: file.size,
    mimetype: file.mimetype
  };
}

/**
 * Upload plusieurs fichiers vers MinIO.
 */
export async function uploadFiles(
  files: Express.Multer.File[],
  entity: string
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadFile(file, entity)));
}

/**
 * Supprime un fichier de MinIO par son objectName.
 */
export async function deleteFile(objectName: string): Promise<void> {
  await minioClient.removeObject(MINIO_BUCKET, objectName);
}

/**
 * Génère une URL pré-signée (optionnelle, pour accès temporaire).
 *
 * @param objectName - Nom de l'objet dans le bucket
 * @param expiry - Durée de validité en secondes (défaut 7 jours)
 */
export async function getPresignedUrl(objectName: string, expiry = 7 * 24 * 60 * 60): Promise<string> {
  return minioClient.presignedGetObject(MINIO_BUCKET, objectName, expiry);
}
