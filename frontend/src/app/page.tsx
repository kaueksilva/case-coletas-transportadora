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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Acompanhamento de Coletas</h1>
          <p className="text-sm text-slate-500">
            Filtre por situação, cliente e período. Coletas de prioridade alta ficam em destaque.
          </p>
        </div>
        <Link
          href="/coletas/nova"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nova coleta
        </Link>
      </div>

      {/* Filtros */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Situação</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPagina(1); }}
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            >
              <option value="">Todas</option>
              <option value={StatusColeta.Aberta}>Aberta</option>
              <option value={StatusColeta.EmColeta}>Em Coleta</option>
              <option value={StatusColeta.Coletada}>Coletada</option>
              <option value={StatusColeta.Cancelada}>Cancelada</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Cliente</label>
            <input
              value={cliente}
              onChange={(e) => { setCliente(e.target.value); setPagina(1); }}
              placeholder="Nome do cliente"
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Prioridade</label>
            <select
              value={prioridade}
              onChange={(e) => { setPrioridade(e.target.value); setPagina(1); }}
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            >
              <option value="">Todas</option>
              <option value={Prioridade.Baixa}>Baixa</option>
              <option value={Prioridade.Media}>Média</option>
              <option value={Prioridade.Alta}>Alta</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">De</label>
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => { setDataInicial(e.target.value); setPagina(1); }}
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Até</label>
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => { setDataFinal(e.target.value); setPagina(1); }}
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={limparFiltros}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {erro && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Número</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Data coleta</th>
              <th className="px-4 py-3">Prioridade</th>
              <th className="px-4 py-3">Situação</th>
              <th className="px-4 py-3">Motorista/Veículo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {carregando ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-400">Carregando...</td></tr>
            ) : dados && dados.itens.length > 0 ? (
              dados.itens.map((c) => (
                <tr key={c.id} className={c.prioridadeAlta ? "bg-red-50/60" : ""}>
                  <td className="px-4 py-3 font-mono text-xs">{c.numero}</td>
                  <td className="px-4 py-3 font-medium">{c.cliente}</td>
                  <td className="px-4 py-3 text-slate-600">{formatarData(c.dataColeta)}</td>
                  <td className="px-4 py-3"><PrioridadeBadge prioridade={c.prioridade} descricao={c.prioridadeDescricao} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} descricao={c.statusDescricao} /></td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.motoristaNome ? `${c.motoristaNome} / ${c.veiculoPlaca}` : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/coletas/${c.id}`} className="text-blue-600 hover:underline">Detalhes</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-400">Nenhuma coleta encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {dados && dados.totalPaginas > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            {dados.totalItens} coleta(s) — página {dados.pagina} de {dados.totalPaginas}
          </span>
          <div className="flex gap-2">
            <button
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => p - 1)}
              className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              disabled={pagina >= dados.totalPaginas}
              onClick={() => setPagina((p) => p + 1)}
              className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
