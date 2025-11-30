import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aeronaveRoutes from './routes/aeronaveRoutes';
import funcionarioRoutes from './routes/funcionarioRoutes';
import pecaRoutes from './routes/pecaRoutes';
import etapaRoutes from './routes/etapaRoutes';
import testeRoutes from './routes/testeRoutes';
import authRoutes from './routes/authRoutes';
import relatorioRoutes from './routes/relatorioRoutes';
import metricsRoutes from './routes/metricsRoutes'; // 
import { performanceMiddleware, getMetricsSummary, clearMetrics } from './middleware/performanceMiddleware';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(performanceMiddleware); 

app.get('/', (req, res) => {
  res.json({ 
    message: 'API AeroCode - Sistema de Gestão de Aeronaves',
    version: '1.0.0',
    status: 'online'
  });
});

app.get('/api/metrics/summary', (req, res) => {
  const summary = getMetricsSummary();
  res.json({
    success: true,
    data: summary,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/metrics/clear', (req, res) => {
  clearMetrics();
  res.json({ 
    success: true, 
    message: 'Métricas limpas com sucesso',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/metrics/status', (req, res) => {
  const summary = getMetricsSummary();
  res.json({
    totalRequests: summary?.total || 0,
    avgResponseTime: summary ? `${summary.averageResponseTime.toFixed(2)}ms` : 'N/A',
    avgProcessingTime: summary ? `${summary.averageProcessingTime.toFixed(2)}ms` : 'N/A',
    avgLatency: summary ? `${summary.averageLatency.toFixed(2)}ms` : 'N/A',
    status: '🟢 PERFORMANCE MONITORING ATIVO'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/aeronaves', aeronaveRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/pecas', pecaRoutes);
app.use('/api/etapas', etapaRoutes);
app.use('/api/testes', testeRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/metrics', metricsRoutes); 

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('==========================================');
  console.log('  🚀 Servidor AeroCode Iniciado');
  console.log('==========================================');
  console.log(`  📡 Porta: ${PORT}`);
  console.log(`  🌐 URL: http://localhost:${PORT}`);
  console.log(`  📚 API: http://localhost:${PORT}/api`);
  console.log(`  📊 Métricas: http://localhost:${PORT}/api/metrics/summary`);
  console.log('==========================================');
});

export default app;
