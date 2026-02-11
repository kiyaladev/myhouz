import { Router } from 'express';
import { SearchController } from '../controllers/SearchController';

const router = Router();

router.get('/', SearchController.globalSearch);
router.get('/suggestions', SearchController.suggestions);

export default router;
