import prisma from '../config/database';
import { CreateAeronaveDto, UpdateAeronaveDto } from '../types';

export class AeronaveService {
  async criar(data: CreateAeronaveDto) {
    const aeronaveExiste = await prisma.aeronave.findUnique({
      where: { codigo: data.codigo },
    });

    if (aeronaveExiste) {
      throw new Error('Já existe uma aeronave com este código.');
    }

    return await prisma.aeronave.create({
      data: {
        codigo: data.codigo,
        modelo: data.modelo,
        fabricante: data.fabricante,
        tipo: data.tipo,
        anoFabricacao: data.anoFabricacao,
        capacidade: data.capacidade,
        kmAtual: data.kmAtual,
        status: data.status,
        alcance: data.alcance
      },
      include: { pecas: true, etapas: true, testes: true }
    });
  }

  async listar() {
    return await prisma.aeronave.findMany({
      include: {
        pecas: true,
        etapas: {
          include: {
            funcionarios: true,
          },
        },
        testes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async buscarPorId(id: number) {
    const aeronave = await prisma.aeronave.findUnique({
      where: { id },
      include: {
        pecas: true,
        etapas: {
          include: {
            funcionarios: true,
          },
        },
        testes: true,
      },
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada.');
    }

    return aeronave;
  }

  async buscarPorCodigo(codigo: string) {
    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo },
      include: {
        pecas: true,
        etapas: {
          include: {
            funcionarios: true,
          },
        },
        testes: true,
      },
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada.');
    }

    return aeronave;
  }

  async atualizar(id: number, data: UpdateAeronaveDto) {
    await this.buscarPorId(id);

    return await prisma.aeronave.update({
      where: { id },
      data,
      include: {
        pecas: true,
        etapas: true,
        testes: true,
      },
    });
  }

  async deletar(id: number) {
    await this.buscarPorId(id);

    return await prisma.aeronave.delete({
      where: { id },
    });
  }

  async listarPorTipo(tipo: 'COMERCIAL' | 'MILITAR') {
    return await prisma.aeronave.findMany({
      where: { tipo },
      include: {
        pecas: true,
        etapas: true,
        testes: true,
      },
    });
  }
}
