import { Router } from 'express';
import { AeronaveController } from '../controllers/aeronaveController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const aeronaveController = new AeronaveController();

router.post('/', authMiddleware, aeronaveController.criar);
router.get('/', authMiddleware, aeronaveController.listar);
router.get('/:id', authMiddleware, aeronaveController.buscarPorId);
router.get('/codigo/:codigo', authMiddleware, aeronaveController.buscarPorCodigo);
router.get('/tipo/:tipo', authMiddleware, aeronaveController.listarPorTipo);
router.put('/:id', authMiddleware, aeronaveController.atualizar);
router.delete('/:id', authMiddleware, aeronaveController.deletar);

export default router;
