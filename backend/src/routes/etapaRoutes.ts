import { Router } from 'express';
import { EtapaController } from '../controllers/etapaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const etapaController = new EtapaController();

router.post('/', authMiddleware, etapaController.criar);
router.get('/', authMiddleware, etapaController.listar);
router.get('/aeronave/:aeronaveId', authMiddleware, etapaController.listarPorAeronave);
router.get('/aeronave/codigo/:codigo', authMiddleware, etapaController.listarPorAeronaveCodigo);
router.post('/:etapaId/funcionario/:funcionarioId', authMiddleware, etapaController.associarFuncionario);
router.patch('/:etapaId', authMiddleware, etapaController.atualizarStatus);

export default router;
