import { Router } from 'express';
import { RelatorioController } from '../controllers/relatorioController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const relatorioController = new RelatorioController(); 

router.post('/', authMiddleware, relatorioController.criar);
router.get('/', authMiddleware, relatorioController.listar);
router.get('/dashboard', relatorioController.dashboard); 

router.get('/aeronave/:aeronaveId', authMiddleware, relatorioController.listarPorAeronave);
router.get('/gerar/:aeronaveId', relatorioController.gerarPorAeronave); // SEM authMiddleware
router.get('/:id', authMiddleware, relatorioController.buscarPorId);
router.get('/:id/download', authMiddleware, relatorioController.downloadPDF);
router.delete('/:id', authMiddleware, relatorioController.deletar);

export default router;
