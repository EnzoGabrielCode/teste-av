import { Router } from 'express';
import { TesteController } from '../controllers/testeController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const testeController = new TesteController();

router.post('/', authMiddleware, testeController.criar);
router.get('/', authMiddleware, testeController.listar);
router.get('/:id', authMiddleware, testeController.buscarPorId);
router.get('/aeronave/:aeronaveId', authMiddleware, testeController.listarPorAeronave);
router.get('/resultado/:resultado', authMiddleware, testeController.listarPorResultado);
router.delete('/:id', authMiddleware, testeController.deletar);

export default router;
