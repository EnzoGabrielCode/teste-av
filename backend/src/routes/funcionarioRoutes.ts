import { Router } from 'express';
import { FuncionarioController } from '../controllers/funcionarioController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const funcionarioController = new FuncionarioController();

router.post('/', authMiddleware, funcionarioController.criar);
router.get('/', authMiddleware, funcionarioController.listar);
router.get('/:id', authMiddleware, funcionarioController.buscarPorId);
router.get('/nivel/:nivel', authMiddleware, funcionarioController.listarPorNivel);
router.put('/:id', authMiddleware, funcionarioController.atualizar);
router.delete('/:id', authMiddleware, funcionarioController.deletar);

export default router;
