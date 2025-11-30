import prisma from '../config/database';
import { CreateFuncionarioDto, UpdateFuncionarioDto } from '../types';
import bcrypt from 'bcrypt';

export class FuncionarioService {
  async criar(data: CreateFuncionarioDto) {
    const funcionarioExiste = await prisma.funcionario.findUnique({
      where: { usuario: data.usuario },
    });

    if (funcionarioExiste) {
      throw new Error('Já existe um funcionário com este usuário.');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    return await prisma.funcionario.create({
      data: {
        ...data,
        senha: senhaHash,
      },
      select: {
        id: true,
        nome: true,
        telefone: true,
        endereco: true,
        usuario: true,
        nivelPermissao: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async listar() {
    return await prisma.funcionario.findMany({
      select: {
        id: true,
        nome: true,
        telefone: true,
        endereco: true,
        usuario: true,
        nivelPermissao: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async buscarPorId(id: number) {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        telefone: true,
        endereco: true,
        usuario: true,
        nivelPermissao: true,
        etapas: {
          include: {
            aeronave: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!funcionario) {
      throw new Error('Funcionário não encontrado.');
    }

    return funcionario;
  }

  async buscarPorUsuario(usuario: string) {
    const funcionario = await prisma.funcionario.findUnique({
      where: { usuario },
      select: {
        id: true,
        nome: true,
        telefone: true,
        endereco: true,
        usuario: true,
        senha: true,
        nivelPermissao: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return funcionario;
  }

  async atualizar(id: number, data: UpdateFuncionarioDto) {
    await this.buscarPorId(id);

    return await prisma.funcionario.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        telefone: true,
        endereco: true,
        usuario: true,
        nivelPermissao: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deletar(id: number) {
    await this.buscarPorId(id);

    return await prisma.funcionario.delete({
      where: { id },
    });
  }

  async listarPorNivel(nivelPermissao: 'ADMINISTRADOR' | 'ENGENHEIRO' | 'OPERADOR') {
    return await prisma.funcionario.findMany({
      where: { nivelPermissao },
      select: {
        id: true,
        nome: true,
        telefone: true,
        endereco: true,
        usuario: true,
        nivelPermissao: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
