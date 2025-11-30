import prisma from '../config/database';
import PDFDocument from 'pdfkit';
import { CreateRelatorioDto } from '../types';

export class RelatorioService {
  async criar(data: CreateRelatorioDto) {
    const aeronaveId = parseInt(String(data.aeronaveId));
    const usuarioId = parseInt(String(data.usuarioId));

    const aeronave = await prisma.aeronave.findUnique({
      where: { id: aeronaveId }
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada');
    }

    const relatorio = await prisma.relatorio.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        aeronaveId: aeronaveId,
        usuarioId: usuarioId
      },
      include: {
        aeronave: true
      }
    });

    return relatorio;
  }

  async listar() {
    return await prisma.relatorio.findMany({
      include: {
        aeronave: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async listarPorAeronave(aeronaveId: number) {
    return await prisma.relatorio.findMany({
      where: { aeronaveId },
      include: {
        aeronave: true
      }
    });
  }

  async buscarPorId(id: number) {
    const relatorio = await prisma.relatorio.findUnique({
      where: { id },
      include: {
        aeronave: {
          include: {
            pecas: true,
            etapas: {
              include: {
                funcionarios: true
              }
            },
            testes: true
          }
        }
      }
    });

    if (!relatorio) {
      throw new Error('Relatório não encontrado');
    }

    return relatorio;
  }

  async gerarPDF(relatorioId: number) {
    const relatorio = await this.buscarPorId(relatorioId);
    const aeronave = relatorio.aeronave;

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => buffers.push(chunk));
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });

        doc.fontSize(24).font('Helvetica-Bold').text('RELATÓRIO DE AERONAVE', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica').text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
        doc.moveDown(1);

        doc.fontSize(16).font('Helvetica-Bold').text('Informações da Aeronave');
        doc.fontSize(11).font('Helvetica');
        doc.text(`Código: ${aeronave.codigo}`);
        doc.text(`Modelo: ${aeronave.modelo}`);
        doc.text(`Fabricante: ${aeronave.fabricante || 'N/A'}`);
        doc.text(`Tipo: ${aeronave.tipo}`);
        doc.text(`Ano Fabricação: ${aeronave.anoFabricacao}`);
        doc.text(`Capacidade: ${aeronave.capacidade} passageiros`);
        doc.text(`KM Atual: ${aeronave.kmAtual} km`);
        doc.text(`Alcance: ${aeronave.alcance} km`);
        doc.text(`Status: ${aeronave.status}`);
        doc.moveDown(1);

        if (aeronave.pecas && aeronave.pecas.length > 0) {
          doc.fontSize(16).font('Helvetica-Bold').text('Peças Instaladas');
          doc.fontSize(11).font('Helvetica');
          aeronave.pecas.forEach((peca, index) => {
            doc.text(`${index + 1}. ${peca.nome} (${peca.tipo}) - Fornecedor: ${peca.fornecedor}`);
          });
          doc.moveDown(0.5);
        }

        if (aeronave.etapas && aeronave.etapas.length > 0) {
          doc.fontSize(16).font('Helvetica-Bold').text('Etapas de Produção');
          doc.fontSize(11).font('Helvetica');
          aeronave.etapas.forEach((etapa, index) => {
            doc.text(`${index + 1}. ${etapa.nome}`);
            doc.text(`   Status: ${etapa.status}`, { indent: 20 });
            doc.text(`   Prazo: ${new Date(etapa.prazo).toLocaleDateString('pt-BR')}`, { indent: 20 });
            if (etapa.funcionarios && etapa.funcionarios.length > 0) {
              doc.text(`   Funcionários: ${etapa.funcionarios.map(f => f.nome).join(', ')}`, { indent: 20 });
            }
          });
          doc.moveDown(0.5);
        }

        if (aeronave.testes && aeronave.testes.length > 0) {
          doc.fontSize(16).font('Helvetica-Bold').text('Testes Realizados');
          doc.fontSize(11).font('Helvetica');
          aeronave.testes.forEach((teste, index) => {
            doc.text(`${index + 1}. Tipo: ${teste.tipo} - Resultado: ${teste.resultado}`);
          });
          doc.moveDown(0.5);
        }

        doc.fontSize(12).font('Helvetica-Bold').text('Relatório Técnico');
        doc.fontSize(11).font('Helvetica');
        doc.text(`Título: ${relatorio.titulo}`);
        doc.text(`Descrição: ${relatorio.descricao}`);
        doc.text(`Gerado por: Sistema AeroCode`);
        doc.text(`Data: ${new Date().toLocaleString('pt-BR')}`);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // NOVO MÉTODO - Gera PDF direto da aeronave
  async gerarPorAeronave(aeronaveId: number, tipo?: string): Promise<Buffer> {
    // Cria um relatório temporário
    const relatorio = await this.criar({
      titulo: `Relatório ${tipo || 'completo'} - Aeronave ${aeronaveId}`,
      descricao: `Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}`,
      aeronaveId: aeronaveId,
      usuarioId: 1
    });

    // Gera e retorna o PDF
    return await this.gerarPDF(relatorio.id);
  }

  async deletar(id: number) {
    return await prisma.relatorio.delete({
      where: { id }
    });
  }

  async getDashboardStats() {
    const totalAeronaves = await prisma.aeronave.count();
    const totalFuncionarios = await prisma.funcionario.count();
    const etapasPendentes = await prisma.etapa.count({ where: { status: 'PENDENTE' } });
    const etapasAndamento = await prisma.etapa.count({ where: { status: 'ANDAMENTO' } });
    const etapasConcluidas = await prisma.etapa.count({ where: { status: 'CONCLUIDA' } });
    const testesAprovados = await prisma.teste.count({ where: { resultado: 'APROVADO' } });
    const testesReprovados = await prisma.teste.count({ where: { resultado: 'REPROVADO' } });
    const aeronavesRaw = await prisma.aeronave.findMany({
      take: 10, 
      orderBy: { updatedAt: 'desc' },
      include: {
        etapas: true
      }
    });

    const aeronaves = aeronavesRaw.map(a => {
      const concluidas = a.etapas.filter(e => e.status === 'CONCLUIDA').length;
      return {
        modelo: a.modelo,
        etapasConcluidas: concluidas,
        etapasTotais: a.etapas.length
      };
    });

    return {
      totalAeronaves,
      totalFuncionarios,
      etapasPendentes, 
      etapasAndamento,
      etapasConcluidas,
      testesAprovados,
      testesReprovados,
      aeronaves 
    };
  }
}
