import { Router } from 'express';
import { PecaController } from '../controllers/pecaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const pecaController = new PecaController();

router.post('/', authMiddleware, pecaController.criar);
router.get('/', authMiddleware, pecaController.listar);
router.get('/:id', authMiddleware, pecaController.buscarPorId);
router.get('/aeronave/:aeronaveId', authMiddleware, pecaController.listarPorAeronave);
router.get('/tipo/:tipo', authMiddleware, pecaController.listarPorTipo);
router.delete('/:id', authMiddleware, pecaController.deletar);

export default router;
