import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const adminExiste = await prisma.funcionario.findUnique({
    where: { usuario: 'adm' },
  });

  if (adminExiste) {
    console.log('✅ Usuários já existem no banco!');
    return;
  }

  const senhaHashAdmin = await bcrypt.hash('123456', 10);
  const senhaHashEng = await bcrypt.hash('123456', 10);
  const senhaHashOp = await bcrypt.hash('123456', 10);

  await prisma.funcionario.create({
    data: {
      nome: 'Administrador',
      telefone: '11999999999',
      endereco: 'Rua eugenio, 123',
      usuario: 'adm',
      senha: senhaHashAdmin,
      nivelPermissao: 'ADMINISTRADOR',
    },
  });

  await prisma.funcionario.create({
    data: {
      nome: 'Ronaldo',
      telefone: '12999999999',
      endereco: 'Rua flor, 456',
      usuario: 'eng',
      senha: senhaHashEng,
      nivelPermissao: 'ENGENHEIRO',
    },
  });

  await prisma.funcionario.create({
    data: {
      nome: 'José',
      telefone: '11977777777',
      endereco: 'Rua marcelo, 789',
      usuario: 'ope',
      senha: senhaHashOp,
      nivelPermissao: 'OPERADOR',
    },
  });

  console.log('✅ Dados iniciais criados com sucesso!');
  console.log('');
  console.log('📝 Usuários criados:');
  console.log('  1. adm / 123456 (ADMINISTRADOR)');
  console.log('  2. eng / 123456 (ENGENHEIRO)');
  console.log('  3. ope / 123456 (OPERADOR)');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });