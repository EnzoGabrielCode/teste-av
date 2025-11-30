import { Request, Response } from 'express';
import { FuncionarioService } from '../services/funcionarioService';

const funcionarioService = new FuncionarioService();

export class FuncionarioController {
  async criar(req: Request, res: Response) {
    try {
      const funcionario = await funcionarioService.criar(req.body);
      res.status(201).json(funcionario);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const funcionarios = await funcionarioService.listar();
      res.json(funcionarios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const funcionario = await funcionarioService.buscarPorId(
        Number(req.params.id)
      );
      res.json(funcionario);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const funcionario = await funcionarioService.atualizar(
        Number(req.params.id),
        req.body
      );
      res.json(funcionario);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      await funcionarioService.deletar(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarPorNivel(req: Request, res: Response) {
    try {
      const nivel = req.params.nivel.toUpperCase() as 
        'ADMINISTRADOR' | 'ENGENHEIRO' | 'OPERADOR';
      const funcionarios = await funcionarioService.listarPorNivel(nivel);
      res.json(funcionarios);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
