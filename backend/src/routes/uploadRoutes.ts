import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload';
import { uploadFile, uploadFiles, deleteFile } from '../services/uploadService';

const router = Router();

// Upload d'une seule image
router.post(
  '/single',
  authenticateToken,
  uploadSingle,
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Aucun fichier fourni' });
        return;
      }

      const entity = (req.query.entity as string) || 'misc';
      const result = await uploadFile(req.file, entity);

      res.json({
        success: true,
        message: 'Fichier uploadé avec succès',
        data: result
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de l\'upload du fichier' });
    }
  }
);

// Upload de plusieurs images
router.post(
  '/multiple',
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
      const results = await uploadFiles(files, entity);

      res.json({
        success: true,
        message: `${results.length} fichier(s) uploadé(s) avec succès`,
        data: results
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload multiple:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de l\'upload des fichiers' });
    }
  }
);

// Supprimer un fichier
router.delete(
  '/',
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
      console.error('Erreur lors de la suppression:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression du fichier' });
    }
  }
);

// Gestion des erreurs Multer
router.use(handleUploadError);

export default router;
