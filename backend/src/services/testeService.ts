import prisma from '../config/database';
import { CreateTesteDto } from '../types';

export class TesteService {
  async criar(data: CreateTesteDto) {
    const aeronave = await prisma.aeronave.findUnique({
      where: { id: data.aeronaveId },
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada.');
    }

    return await prisma.teste.create({
      data,
      include: {
        aeronave: true,
      },
    });
  }

  async listar() {
    return await prisma.teste.findMany({
      include: {
        aeronave: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async buscarPorId(id: number) {
    const teste = await prisma.teste.findUnique({
      where: { id },
      include: {
        aeronave: true,
      },
    });

    if (!teste) {
      throw new Error('Teste não encontrado.');
    }

    return teste;
  }

  async listarPorAeronave(aeronaveId: number) {
    return await prisma.teste.findMany({
      where: { aeronaveId },
      include: {
        aeronave: true,
      },
    });
  }

  async deletar(id: number) {
    await this.buscarPorId(id);

    return await prisma.teste.delete({
      where: { id },
    });
  }

  async listarPorResultado(resultado: 'APROVADO' | 'REPROVADO') {
    return await prisma.teste.findMany({
      where: { resultado },
      include: {
        aeronave: true,
      },
    });
  }
}
