import prisma from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginDto } from '../types';

export class AuthService {
  async login(data: LoginDto) {
    const funcionario = await prisma.funcionario.findUnique({
      where: { usuario: data.usuario },
    });

    if (!funcionario) {
      throw new Error('Usuário ou senha incorretos.');
    }

    const senhaValida = await bcrypt.compare(data.senha, funcionario.senha);

    if (!senhaValida) {
      throw new Error('Usuário ou senha incorretos.');
    }

    const token = jwt.sign(
      {
        id: funcionario.id,
        usuario: funcionario.usuario,
        nivelPermissao: funcionario.nivelPermissao,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return {
      token,
      funcionario: {
        id: funcionario.id,
        nome: funcionario.nome,
        usuario: funcionario.usuario,
        nivelPermissao: funcionario.nivelPermissao,
      },
    };
  }

  async verificarToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      return decoded;
    } catch (error) {
      throw new Error('Token inválido ou expirado.');
    }
  }
}
