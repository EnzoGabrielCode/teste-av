export interface CreateAeronaveDto {
  codigo: string;
  modelo: string;
  fabricante: string;
  tipo: 'COMERCIAL' | 'MILITAR';
  anoFabricacao: number;
  capacidade: number;
  kmAtual: number;
  status: 'EM_MANUTENCAO' | 'EM_PRODUCAO' | 'CONCLUIDA' | 'CANCELADA';
  alcance: number;
}

export interface UpdateAeronaveDto {
  modelo?: string;
  fabricante?: string;
  tipo?: 'COMERCIAL' | 'MILITAR';
  anoFabricacao?: number;
  capacidade?: number;
  kmAtual?: number;
  status?: 'EM_MANUTENCAO' | 'EM_PRODUCAO' | 'CONCLUIDA' | 'CANCELADA';
  alcance?: number;
}


export interface CreateFuncionarioDto {
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: 'ADMINISTRADOR' | 'ENGENHEIRO' | 'OPERADOR';
}

export interface UpdateFuncionarioDto {
  nome?: string;
  telefone?: string;
  endereco?: string;
  nivelPermissao?: 'ADMINISTRADOR' | 'ENGENHEIRO' | 'OPERADOR';
}

export interface CreatePecaDto {
  nome: string;
  tipo: 'NACIONAL' | 'IMPORTADA';
  fornecedor: string;
  aeronaveId: number;
}

export interface CreateEtapaDto {
  nome: string;
  prazo: string;
  aeronaveId: number;
}

export interface UpdateEtapaDto {
  nome?: string;
  prazo?: string;
  status?: 'PENDENTE' | 'ANDAMENTO' | 'CONCLUIDA';
}

export interface CreateTesteDto {
  tipo: 'ELETRICO' | 'HIDRAULICO' | 'AERODINAMICO';
  resultado: 'APROVADO' | 'REPROVADO';
  aeronaveId: number;
}

export interface LoginDto {
  usuario: string;
  senha: string;
}

export interface DashboardStats {
  totalAeronaves: number;
  totalFuncionarios: number;
  etapasPendentes: number;
  etapasAndamento: number;
  etapasConcluidas: number;
  testesAprovados: number;
  testesReprovados: number;
  aeronaves: {
    modelo: string;
    etapasConcluidas: number;
    etapasTotais: number;
  }[];
}
export interface CreateRelatorioDto {
  titulo: string;
  descricao: string;
  aeronaveId: number;
  usuarioId: number;
}
