import prisma from '../config/database';
import { CreateEtapaDto } from '../types';

export class EtapaService {
  async criar(data: CreateEtapaDto) {
    const aeronaveId = parseInt(data.aeronaveId);
    
    const aeronave = await prisma.aeronave.findUnique({
      where: { id: aeronaveId }
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada');
    }

    return await prisma.etapa.create({
      data: {
        nome: data.nome,
        prazo: new Date(data.prazo),
        aeronaveId: aeronaveId
      },
      include: {
        aeronave: true,
        funcionarios: true
      }
    });
  }

  async listar() {
    return await prisma.etapa.findMany({
      include: {
        aeronave: true,
        funcionarios: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async listarPorAeronave(aeronaveId: number) {
    return await prisma.etapa.findMany({
      where: {
        aeronaveId: aeronaveId
      },
      include: {
        aeronave: true,
        funcionarios: true
      }
    });
  }

  async listarPorAeronaveCodigo(codigo: string) {
    return await prisma.etapa.findMany({
      where: {
        aeronave: {
          codigo: codigo
        }
      },
      include: {
        aeronave: true,
        funcionarios: true
      }
    });
  }

  async associarFuncionario(etapaId: number, funcionarioId: number) {
    const etapa = await prisma.etapa.findUnique({
      where: { id: etapaId }
    });

    if (!etapa) {
      throw new Error('Etapa não encontrada');
    }

    return await prisma.etapa.update({
      where: { id: etapaId },
      data: {
        funcionarios: {
          connect: {
            id: funcionarioId
          }
        }
      },
      include: {
        aeronave: true,
        funcionarios: true
      }
    });
  }

  async atualizarStatus(etapaId: number, status: string) {
    return await prisma.etapa.update({
      where: { id: etapaId },
      data: { status: status },
      include: {
        aeronave: true,
        funcionarios: true
      }
    });
  }

  async deletar(etapaId: number) {
    return await prisma.etapa.delete({
      where: { id: etapaId }
    });
  }
}
