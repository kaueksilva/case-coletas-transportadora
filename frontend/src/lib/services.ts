import { apiFetch } from "./api";
import {
  AuthResponse,
  Coleta,
  ColetaFiltro,
  Motorista,
  Ocorrencia,
  PagedResult,
  Veiculo,
} from "./types";

export const authService = {
  login: (email: string, senha: string) =>
    apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: { email, senha },
      auth: false,
    }),
  registrar: (nome: string, email: string, senha: string) =>
    apiFetch<AuthResponse>("/api/auth/registrar", {
      method: "POST",
      body: { nome, email, senha },
      auth: false,
    }),
};

function montarQuery(filtro: ColetaFiltro): string {
  const params = new URLSearchParams();
  if (filtro.status) params.set("status", String(filtro.status));
  if (filtro.cliente) params.set("cliente", filtro.cliente);
  if (filtro.prioridade) params.set("prioridade", String(filtro.prioridade));
  if (filtro.dataInicial) params.set("dataInicial", filtro.dataInicial);
  if (filtro.dataFinal) params.set("dataFinal", filtro.dataFinal);
  params.set("pagina", String(filtro.pagina ?? 1));
  params.set("tamanhoPagina", String(filtro.tamanhoPagina ?? 10));
  return params.toString();
}

export const coletaService = {
  listar: (filtro: ColetaFiltro) =>
    apiFetch<PagedResult<Coleta>>(`/api/coletas?${montarQuery(filtro)}`),
  obter: (id: number) => apiFetch<Coleta>(`/api/coletas/${id}`),
  criar: (dados: Partial<Coleta>) =>
    apiFetch<Coleta>("/api/coletas", { method: "POST", body: dados }),
  atribuir: (id: number, motoristaId: number, veiculoId: number) =>
    apiFetch<Coleta>(`/api/coletas/${id}/atribuir`, {
      method: "POST",
      body: { motoristaId, veiculoId },
    }),
  coletar: (id: number) =>
    apiFetch<Coleta>(`/api/coletas/${id}/coletar`, { method: "POST" }),
  cancelar: (id: number) =>
    apiFetch<Coleta>(`/api/coletas/${id}/cancelar`, { method: "POST" }),
  registrarOcorrencia: (id: number, descricao: string) =>
    apiFetch<Ocorrencia>(`/api/coletas/${id}/ocorrencias`, {
      method: "POST",
      body: { descricao },
    }),
};

export const motoristaService = {
  listar: () => apiFetch<Motorista[]>("/api/motoristas"),
};

export const veiculoService = {
  listar: () => apiFetch<Veiculo[]>("/api/veiculos"),
};
