import { Request, Response } from 'express';
import { AeronaveService } from '../services/aeronaveService';

const aeronaveService = new AeronaveService();

export class AeronaveController {
  async criar(req: Request, res: Response) {
    try {
      const aeronave = await aeronaveService.criar(req.body);
      res.status(201).json(aeronave);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const aeronaves = await aeronaveService.listar();
      res.json(aeronaves);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const aeronave = await aeronaveService.buscarPorId(Number(req.params.id));
      res.json(aeronave);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async buscarPorCodigo(req: Request, res: Response) {
    try {
      const aeronave = await aeronaveService.buscarPorCodigo(req.params.codigo);
      res.json(aeronave);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const aeronave = await aeronaveService.atualizar(
        Number(req.params.id),
        req.body
      );
      res.json(aeronave);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      await aeronaveService.deletar(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarPorTipo(req: Request, res: Response) {
    try {
      const tipo = req.params.tipo.toUpperCase() as 'COMERCIAL' | 'MILITAR';
      const aeronaves = await aeronaveService.listarPorTipo(tipo);
      res.json(aeronaves);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
