import { Request, Response } from 'express';
import { RelatorioService } from '../services/relatorioService';

const relatorioService = new RelatorioService();

export class RelatorioController {
  async criar(req: Request, res: Response) {
    try {
      const relatorio = await relatorioService.criar(req.body);
      res.status(201).json(relatorio);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const relatorios = await relatorioService.listar();
      res.json(relatorios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async dashboard(req: Request, res: Response) {
    try {
      const stats = await relatorioService.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarPorAeronave(req: Request, res: Response) {
    try {
      const aeronaveId = parseInt(req.params.aeronaveId);
      const relatorios = await relatorioService.listarPorAeronave(aeronaveId);
      res.json(relatorios);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const relatorio = await relatorioService.buscarPorId(parseInt(req.params.id));
      res.json(relatorio);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async downloadPDF(req: Request, res: Response) {
    try {
      const relatorioId = parseInt(req.params.id);
      const pdf = await relatorioService.gerarPDF(relatorioId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="relatorio-${relatorioId}.pdf"`);
      res.send(pdf);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async gerarPorAeronave(req: Request, res: Response) {
    try {
      const aeronaveId = parseInt(req.params.aeronaveId);
      const { tipo } = req.query;

      const relatorio = await relatorioService.criar({
        titulo: `Relatório ${tipo || 'completo'} - Aeronave ${aeronaveId}`,
        descricao: `Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}`,
        aeronaveId: aeronaveId,
        usuarioId: 1 
      });

      const pdfBuffer = await relatorioService.gerarPDF(relatorio.id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="relatorio-aeronave-${aeronaveId}.pdf"`);
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      await relatorioService.deletar(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
