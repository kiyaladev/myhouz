import path from 'path';
import minioClient, { MINIO_BUCKET } from '../config/minio';

/**
 * Génère l'URL publique d'un objet MinIO.
 */
function getPublicUrl(objectName: string): string {
  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
  const port = process.env.MINIO_PORT || '9000';
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  return `${protocol}://${endpoint}:${port}/${MINIO_BUCKET}/${objectName}`;
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
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const extension = path.extname(file.originalname);
  const objectName = `${folder}/${file.fieldname}-${uniqueSuffix}${extension}`;

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
