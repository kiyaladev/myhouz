import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../middleware/auth';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload';
import { uploadFile, uploadFiles, deleteFile } from '../services/uploadService';

const router = Router();

const ALLOWED_ENTITIES = ['projects', 'products', 'profiles', 'ideabooks', 'reviews', 'articles'];

// Limite de débit pour les uploads : 30 requêtes par minute par IP
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Trop de requêtes d\'upload. Réessayez plus tard.' }
});

// Upload d'une seule image
router.post(
  '/single',
  uploadLimiter,
  authenticateToken,
  uploadSingle,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Aucun fichier fourni' });
        return;
      }

      const entity = (req.query.entity as string) || 'misc';
      if (entity !== 'misc' && !ALLOWED_ENTITIES.includes(entity)) {
        res.status(400).json({ success: false, message: `Type d'entité invalide. Types autorisés: ${ALLOWED_ENTITIES.join(', ')}` });
        return;
      }

      const result = await uploadFile(req.file, entity);

      res.json({
        success: true,
        message: 'Fichier uploadé avec succès',
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de l\'upload:', message);
      res.status(500).json({ success: false, message: 'Erreur lors de l\'upload du fichier' });
    }
  }
);

// Upload de plusieurs images
router.post(
  '/multiple',
  uploadLimiter,
  authenticateToken,
  uploadMultiple,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        res.status(400).json({ success: false, message: 'Aucun fichier fourni' });
        return;
      }

      const entity = (req.query.entity as string) || 'misc';
      if (entity !== 'misc' && !ALLOWED_ENTITIES.includes(entity)) {
        res.status(400).json({ success: false, message: `Type d'entité invalide. Types autorisés: ${ALLOWED_ENTITIES.join(', ')}` });
        return;
      }

      const results = await uploadFiles(files, entity);

      res.json({
        success: true,
        message: `${results.length} fichier(s) uploadé(s) avec succès`,
        data: results
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de l\'upload multiple:', message);
      res.status(500).json({ success: false, message: 'Erreur lors de l\'upload des fichiers' });
    }
  }
);

// Supprimer un fichier
router.delete(
  '/',
  uploadLimiter,
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { objectName } = req.body;
      if (!objectName || typeof objectName !== 'string') {
        res.status(400).json({ success: false, message: 'objectName requis' });
        return;
      }

      await deleteFile(objectName);

      res.json({ success: true, message: 'Fichier supprimé avec succès' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Erreur lors de la suppression:', message);
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression du fichier' });
    }
  }
);

// Gestion des erreurs Multer
router.use(handleUploadError);

export default router;
