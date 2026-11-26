// Tipos espelhando os DTOs da API.

export enum StatusColeta {
  Aberta = 1,
  EmColeta = 2,
  Coletada = 3,
  Cancelada = 4,
}

export enum Prioridade {
  Baixa = 1,
  Media = 2,
  Alta = 3,
}

export interface AuthResponse {
  token: string;
  expiraEm: string;
  nome: string;
  email: string;
  perfil: string;
}

export interface Ocorrencia {
  id: number;
  descricao: string;
  dataHora: string;
  registradoPor: string;
}

export interface Coleta {
  id: number;
  numero: string;
  cliente: string;
  remetenteNome: string;
  remetenteEndereco: string;
  destinatarioNome: string;
  destinatarioEndereco: string;
  dataColeta: string;
  prioridade: Prioridade;
  prioridadeDescricao: string;
  observacoes?: string | null;
  status: StatusColeta;
  statusDescricao: string;
  motoristaId?: number | null;
  motoristaNome?: string | null;
  veiculoId?: number | null;
  veiculoPlaca?: string | null;
  prioridadeAlta: boolean;
  criadoEm: string;
  atualizadoEm: string;
  ocorrencias: Ocorrencia[];
}

export interface PagedResult<T> {
  itens: T[];
  pagina: number;
  tamanhoPagina: number;
  totalItens: number;
  totalPaginas: number;
}

export interface Motorista {
  id: number;
  nome: string;
  cnh: string;
  telefone?: string | null;
  ativo: boolean;
}

export interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  capacidadeKg: number;
  ativo: boolean;
}

export interface ColetaFiltro {
  status?: StatusColeta;
  cliente?: string;
  prioridade?: Prioridade;
  dataInicial?: string;
  dataFinal?: string;
  pagina?: number;
  tamanhoPagina?: number;
}
