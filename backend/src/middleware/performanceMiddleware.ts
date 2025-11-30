import { Request, Response, NextFunction } from 'express';

interface Metrics {
  latency: number;
  processingTime: number;
  responseTime: number;
  method: string;
  path: string;
  timestamp: string;
  userCount?: number; 
}

const metricsStorage: Metrics[] = [];

export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const clientSentTime = req.headers['x-client-time'] as string;
  const latency = clientSentTime ? startTime - parseInt(clientSentTime) : 0;

  res.on('finish', () => {
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    const responseTime = latency + processingTime;

    const metric: Metrics = {
      latency,
      processingTime,
      responseTime,
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString()
    };

    metricsStorage.push(metric);
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${processingTime}ms`);
    if (metricsStorage.length > 2000) {
      metricsStorage.shift();
    }
  });

  next();
};
export const getMetrics = () => metricsStorage;
export const clearMetrics = () => { metricsStorage.length = 0; return true; };
export const getMetricsSummary = () => {
  const metrics = metricsStorage;
  if (metrics.length === 0) return null;
  
  return {
    total: metrics.length,
    averageLatency: metrics.reduce((sum, m) => sum + m.latency, 0) / metrics.length,
    averageProcessingTime: metrics.reduce((sum, m) => sum + m.processingTime, 0) / metrics.length,
    averageResponseTime: metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length,
    maxResponseTime: Math.max(...metrics.map(m => m.responseTime)),
    minResponseTime: Math.min(...metrics.map(m => m.responseTime)),
    p95: metrics.sort((a,b) => a.responseTime - b.responseTime)[Math.floor(metrics.length * 0.95)]?.responseTime || 0,
    metrics
  };
};
