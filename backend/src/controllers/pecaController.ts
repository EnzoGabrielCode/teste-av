import { Request, Response } from 'express';
import { PecaService } from '../services/pecaService';

const pecaService = new PecaService();

export class PecaController {
  async criar(req: Request, res: Response) {
    try {
      const peca = await pecaService.criar(req.body);
      res.status(201).json(peca);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const pecas = await pecaService.listar();
      res.json(pecas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const peca = await pecaService.buscarPorId(Number(req.params.id));
      res.json(peca);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async listarPorAeronave(req: Request, res: Response) {
    try {
      const pecas = await pecaService.listarPorAeronave(
        Number(req.params.aeronaveId)
      );
      res.json(pecas);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      await pecaService.deletar(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarPorTipo(req: Request, res: Response) {
    try {
      const tipo = req.params.tipo.toUpperCase() as 'NACIONAL' | 'IMPORTADA';
      const pecas = await pecaService.listarPorTipo(tipo);
      res.json(pecas);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
