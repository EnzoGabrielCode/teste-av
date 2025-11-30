import { Request, Response } from 'express';
import { TesteService } from '../services/testeService';

const testeService = new TesteService();

export class TesteController {
  async criar(req: Request, res: Response) {
    try {
      const teste = await testeService.criar(req.body);
      res.status(201).json(teste);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const testes = await testeService.listar();
      res.json(testes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const teste = await testeService.buscarPorId(Number(req.params.id));
      res.json(teste);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async listarPorAeronave(req: Request, res: Response) {
    try {
      const testes = await testeService.listarPorAeronave(
        Number(req.params.aeronaveId)
      );
      res.json(testes);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      await testeService.deletar(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarPorResultado(req: Request, res: Response) {
    try {
      const resultado = req.params.resultado.toUpperCase() as 
        'APROVADO' | 'REPROVADO';
      const testes = await testeService.listarPorResultado(resultado);
      res.json(testes);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
