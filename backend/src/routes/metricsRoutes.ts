import { Router } from 'express';
import { getMetricsSummary, clearMetrics } from '../middleware/performanceMiddleware';

const router = Router();

router.get('/summary', (req, res) => {
  const summary = getMetricsSummary();
  res.json({
    success: true,
    data: summary,
    timestamp: new Date().toISOString()
  });
});

router.post('/clear', (req, res) => {
  clearMetrics();
  res.json({ 
    success: true, 
    message: 'Métricas limpas com sucesso',
    timestamp: new Date().toISOString()
  });
});

router.get('/status', (req, res) => {
  const summary = getMetricsSummary();
  res.json({
    totalRequests: summary?.total || 0,
    avgResponseTime: summary ? `${summary.averageResponseTime.toFixed(2)}ms` : 'N/A',
    avgProcessingTime: summary ? `${summary.averageProcessingTime.toFixed(2)}ms` : 'N/A',
    avgLatency: summary ? `${summary.averageLatency.toFixed(2)}ms` : 'N/A',
    status: '🟢 PERFORMANCE MONITORING ATIVO'
  });
});

export default router;
