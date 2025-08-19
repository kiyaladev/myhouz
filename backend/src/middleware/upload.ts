import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuration du stockage local (pour développement)
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: any) => {
    const uploadDir = getUploadDirectory(req.path);
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

// Fonction pour déterminer le répertoire d'upload basé sur le chemin
function getUploadDirectory(requestPath: string): string {
  const baseDir = 'uploads';
  
  if (requestPath.includes('/projects/')) return `${baseDir}/projects`;
  if (requestPath.includes('/products/')) return `${baseDir}/products`;
  if (requestPath.includes('/users/')) return `${baseDir}/profiles`;
  if (requestPath.includes('/ideabooks/')) return `${baseDir}/ideabooks`;
  if (requestPath.includes('/reviews/')) return `${baseDir}/reviews`;
  return `${baseDir}/misc`;
}

// Configuration de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB par défaut
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`), false);
    }
  }
});

// Middlewares d'upload pour différents cas d'usage
export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 10);
export const uploadProfileImage = upload.single('profileImage');
export const uploadProjectImages = upload.array('projectImages', 20);
export const uploadProductImages = upload.array('productImages', 10);

// Middleware de gestion d'erreurs pour multer
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Fichier trop volumineux. Taille maximale: 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Trop de fichiers. Maximum autorisé dépassé'
      });
    }
  }
  
  if (error.message.includes('Type de fichier non autorisé')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  return res.status(500).json({
    success: false,
    message: 'Erreur lors de l\'upload du fichier'
  });
};
