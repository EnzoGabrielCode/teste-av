import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const adminExiste = await prisma.funcionario.findUnique({
    where: { usuario: 'admin' },
  });

  if (adminExiste) {
    console.log('✅ Usuários já existem no banco!');
    return;
  }

  const senhaHashAdmin = await bcrypt.hash('admin123', 10);
  const senhaHashEng = await bcrypt.hash('eng123', 10);
  const senhaHashOp = await bcrypt.hash('op123', 10);

  await prisma.funcionario.create({
    data: {
      nome: 'Administrador',
      telefone: '11999999999',
      endereco: 'Rua Admin, 123',
      usuario: 'admin',
      senha: senhaHashAdmin,
      nivelPermissao: 'ADMINISTRADOR',
    },
  });

  await prisma.funcionario.create({
    data: {
      nome: 'João Engenheiro',
      telefone: '11988888888',
      endereco: 'Rua Eng, 456',
      usuario: 'engenheiro',
      senha: senhaHashEng,
      nivelPermissao: 'ENGENHEIRO',
    },
  });

  await prisma.funcionario.create({
    data: {
      nome: 'Maria Operadora',
      telefone: '11977777777',
      endereco: 'Rua Op, 789',
      usuario: 'operador',
      senha: senhaHashOp,
      nivelPermissao: 'OPERADOR',
    },
  });

  console.log('✅ Dados iniciais criados com sucesso!');
  console.log('');
  console.log('📝 Usuários criados:');
  console.log('  1. admin / admin123 (ADMINISTRADOR)');
  console.log('  2. engenheiro / eng123 (ENGENHEIRO)');
  console.log('  3. operador / op123 (OPERADOR)');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });