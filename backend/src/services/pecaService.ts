import prisma from '../config/database';
import { CreatePecaDto } from '../types';

export class PecaService {
  async criar(data: CreatePecaDto) {
    const aeronave = await prisma.aeronave.findUnique({
      where: { id: data.aeronaveId },
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada.');
    }

    return await prisma.peca.create({
      data,
      include: {
        aeronave: true,
      },
    });
  }

  async listar() {
    return await prisma.peca.findMany({
      include: {
        aeronave: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async buscarPorId(id: number) {
    const peca = await prisma.peca.findUnique({
      where: { id },
      include: {
        aeronave: true,
      },
    });

    if (!peca) {
      throw new Error('Peça não encontrada.');
    }

    return peca;
  }

  async listarPorAeronave(aeronaveId: number) {
    return await prisma.peca.findMany({
      where: { aeronaveId },
      include: {
        aeronave: true,
      },
    });
  }

  async deletar(id: number) {
    await this.buscarPorId(id);

    return await prisma.peca.delete({
      where: { id },
    });
  }

  async listarPorTipo(tipo: 'NACIONAL' | 'IMPORTADA') {
    return await prisma.peca.findMany({
      where: { tipo },
      include: {
        aeronave: true,
      },
    });
  }
}
