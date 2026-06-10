"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedPage } from "@/components/ProtectedPage";
import { PrioridadeBadge, StatusBadge } from "@/components/Badges";
import { coletaService } from "@/lib/services";
import { Coleta, ColetaFiltro, PagedResult, Prioridade, StatusColeta } from "@/lib/types";
import { ApiError } from "@/lib/api";

const TAMANHO_PAGINA = 8;

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function AcompanhamentoPage() {
  return (
    <ProtectedPage>
      <Acompanhamento />
    </ProtectedPage>
  );
}

function Acompanhamento() {
  const [dados, setDados] = useState<PagedResult<Coleta> | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [status, setStatus] = useState<string>("");
  const [cliente, setCliente] = useState<string>("");
  const [prioridade, setPrioridade] = useState<string>("");
  const [dataInicial, setDataInicial] = useState<string>("");
  const [dataFinal, setDataFinal] = useState<string>("");
  const [pagina, setPagina] = useState(1);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const filtro: ColetaFiltro = {
        status: status ? (Number(status) as StatusColeta) : undefined,
        cliente: cliente || undefined,
        prioridade: prioridade ? (Number(prioridade) as Prioridade) : undefined,
        dataInicial: dataInicial || undefined,
        dataFinal: dataFinal || undefined,
        pagina,
        tamanhoPagina: TAMANHO_PAGINA,
      };
      const resultado = await coletaService.listar(filtro);
      setDados(resultado);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro ao carregar coletas.");
    } finally {
      setCarregando(false);
    }
  }, [status, cliente, prioridade, dataInicial, dataFinal, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function limparFiltros() {
    setStatus("");
    setCliente("");
    setPrioridade("");
    setDataInicial("");
    setDataFinal("");
    setPagina(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Operação
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Acompanhamento de Coletas
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Filtre por situação, cliente e período. Coletas de prioridade alta ficam em destaque.
          </p>
        </div>
        <Link href="/coletas/nova" className="app-button-primary">
          + Nova coleta
        </Link>
      </div>

      <div className="app-panel">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="app-label">Situação</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPagina(1);
              }}
              className="app-input"
            >
              <option value="">Todas</option>
              <option value={StatusColeta.Aberta}>Aberta</option>
              <option value={StatusColeta.EmColeta}>Em Coleta</option>
              <option value={StatusColeta.Coletada}>Coletada</option>
              <option value={StatusColeta.Cancelada}>Cancelada</option>
            </select>
          </div>
          <div>
            <label className="app-label">Cliente</label>
            <input
              value={cliente}
              onChange={(e) => {
                setCliente(e.target.value);
                setPagina(1);
              }}
              placeholder="Nome do cliente"
              className="app-input"
            />
          </div>
          <div>
            <label className="app-label">Prioridade</label>
            <select
              value={prioridade}
              onChange={(e) => {
                setPrioridade(e.target.value);
                setPagina(1);
              }}
              className="app-input"
            >
              <option value="">Todas</option>
              <option value={Prioridade.Baixa}>Baixa</option>
              <option value={Prioridade.Media}>Média</option>
              <option value={Prioridade.Alta}>Alta</option>
            </select>
          </div>
          <div>
            <label className="app-label">De</label>
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => {
                setDataInicial(e.target.value);
                setPagina(1);
              }}
              className="app-input"
            />
          </div>
          <div>
            <label className="app-label">Até</label>
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => {
                setDataFinal(e.target.value);
                setPagina(1);
              }}
              className="app-input"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button onClick={limparFiltros} className="app-button-secondary">
            Limpar filtros
          </button>
        </div>
      </div>

      {erro && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

      <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50/80 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Número</th>
              <th className="px-5 py-4">Cliente</th>
              <th className="px-5 py-4">Data coleta</th>
              <th className="px-5 py-4">Prioridade</th>
              <th className="px-5 py-4">Situação</th>
              <th className="px-5 py-4">Motorista/Veículo</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/60">
            {carregando ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                  Carregando...
                </td>
              </tr>
            ) : dados && dados.itens.length > 0 ? (
              dados.itens.map((c) => (
                <tr
                  key={c.id}
                  className={c.prioridadeAlta ? "bg-rose-50/60" : "transition hover:bg-slate-50/80"}
                >
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700">{c.numero}</td>
                  <td className="px-5 py-4 font-medium text-slate-900">{c.cliente}</td>
                  <td className="px-5 py-4 text-slate-600">{formatarData(c.dataColeta)}</td>
                  <td className="px-5 py-4">
                    <PrioridadeBadge prioridade={c.prioridade} descricao={c.prioridadeDescricao} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={c.status} descricao={c.statusDescricao} />
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {c.motoristaNome ? `${c.motoristaNome} / ${c.veiculoPlaca}` : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/coletas/${c.id}`}
                      className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                  Nenhuma coleta encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {dados && dados.totalPaginas > 0 && (
        <div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/70 px-5 py-4 text-sm text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-slate-700">
            {dados.totalItens} coleta(s) — página {dados.pagina} de {dados.totalPaginas}
          </span>
          <div className="flex gap-2">
            <button
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => p - 1)}
              className="app-button-secondary px-4 py-2"
            >
              Anterior
            </button>
            <button
              disabled={pagina >= dados.totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
              className="app-button-secondary px-4 py-2"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
