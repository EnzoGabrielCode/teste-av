import { Request, Response } from 'express';
import { EtapaService } from '../services/etapaService';

const etapaService = new EtapaService();

export class EtapaController {
  async criar(req: Request, res: Response) {
    try {
      const etapa = await etapaService.criar(req.body);
      res.status(201).json(etapa);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const etapas = await etapaService.listar();
      res.json(etapas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarPorAeronave(req: Request, res: Response) {
    try {
      const aeronaveId = parseInt(req.params.aeronaveId);
      const etapas = await etapaService.listarPorAeronave(aeronaveId);
      res.json(etapas);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarPorAeronaveCodigo(req: Request, res: Response) {
    try {
      const codigo = req.params.codigo;
      const etapas = await etapaService.listarPorAeronaveCodigo(codigo);
      res.json(etapas);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async associarFuncionario(req: Request, res: Response) {
    try {
      const etapaId = parseInt(req.params.etapaId);
      const funcionarioId = parseInt(req.params.funcionarioId);
      const etapa = await etapaService.associarFuncionario(etapaId, funcionarioId);
      res.json(etapa);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizarStatus(req: Request, res: Response) {
    try {
      const etapaId = parseInt(req.params.etapaId);
      const { status } = req.body;
      const etapa = await etapaService.atualizarStatus(etapaId, status);
      res.json(etapa);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
