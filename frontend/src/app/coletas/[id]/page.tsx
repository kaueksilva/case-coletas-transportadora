"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProtectedPage } from "@/components/ProtectedPage";
import { PrioridadeBadge, StatusBadge } from "@/components/Badges";
import { coletaService, motoristaService, veiculoService } from "@/lib/services";
import { Coleta, Motorista, StatusColeta, Veiculo } from "@/lib/types";
import { ApiError } from "@/lib/api";

export default function ColetaDetalhePage() {
  return (
    <ProtectedPage>
      <ColetaDetalhe />
    </ProtectedPage>
  );
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function ColetaDetalhe() {
  const params = useParams();
  const id = Number(params.id);

  const [coleta, setColeta] = useState<Coleta | null>(null);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [motoristaId, setMotoristaId] = useState<string>("");
  const [veiculoId, setVeiculoId] = useState<string>("");
  const [descricaoOcorrencia, setDescricaoOcorrencia] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const c = await coletaService.obter(id);
      setColeta(c);
      setMotoristaId(c.motoristaId ? String(c.motoristaId) : "");
      setVeiculoId(c.veiculoId ? String(c.veiculoId) : "");
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro ao carregar coleta.");
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
    motoristaService.listar().then(setMotoristas).catch(() => {});
    veiculoService.listar().then(setVeiculos).catch(() => {});
  }, [carregar]);

  async function executar(acao: () => Promise<Coleta>) {
    setErro(null);
    try {
      const atualizada = await acao();
      setColeta(atualizada);
      setMotoristaId(atualizada.motoristaId ? String(atualizada.motoristaId) : "");
      setVeiculoId(atualizada.veiculoId ? String(atualizada.veiculoId) : "");
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro ao executar a ação.");
    }
  }

  async function handleAtribuir(e: FormEvent) {
    e.preventDefault();
    if (!motoristaId || !veiculoId) {
      setErro("Selecione motorista e veículo.");
      return;
    }
    await executar(() => coletaService.atribuir(id, Number(motoristaId), Number(veiculoId)));
  }

  async function handleOcorrencia(e: FormEvent) {
    e.preventDefault();
    if (!descricaoOcorrencia.trim()) return;
    setErro(null);
    try {
      await coletaService.registrarOcorrencia(id, descricaoOcorrencia.trim());
      setDescricaoOcorrencia("");
      await carregar();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro ao registrar ocorrência.");
    }
  }

  if (carregando) return <p className="text-slate-500">Carregando...</p>;
  if (!coleta) return <p className="text-red-600">{erro ?? "Coleta não encontrada."}</p>;

  const finalizada = coleta.status === StatusColeta.Coletada || coleta.status === StatusColeta.Cancelada;
  const podeColetar = coleta.status === StatusColeta.EmColeta;

  const cardClass = "rounded-lg border border-slate-200 bg-white p-5 shadow-sm";
  const labelClass = "text-xs uppercase text-slate-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Voltar</Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-xl font-bold text-slate-800">{coleta.numero}</h1>
          <p className="text-sm text-slate-500">{coleta.cliente}</p>
        </div>
        <div className="flex items-center gap-2">
          <PrioridadeBadge prioridade={coleta.prioridade} descricao={coleta.prioridadeDescricao} />
          <StatusBadge status={coleta.status} descricao={coleta.statusDescricao} />
        </div>
      </div>

      {erro && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Dados */}
        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Dados da coleta</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><p className={labelClass}>Remetente</p><p>{coleta.remetenteNome}</p><p className="text-sm text-slate-500">{coleta.remetenteEndereco}</p></div>
            <div><p className={labelClass}>Destinatário</p><p>{coleta.destinatarioNome}</p><p className="text-sm text-slate-500">{coleta.destinatarioEndereco}</p></div>
            <div><p className={labelClass}>Data da coleta</p><p>{formatarData(coleta.dataColeta)}</p></div>
            <div><p className={labelClass}>Criada em</p><p>{formatarData(coleta.criadoEm)}</p></div>
            {coleta.observacoes && (
              <div className="sm:col-span-2"><p className={labelClass}>Observações</p><p className="text-slate-600">{coleta.observacoes}</p></div>
            )}
          </div>
        </div>

        {/* Ações de status */}
        <div className={cardClass}>
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Operação</h2>

          <form onSubmit={handleAtribuir} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Motorista</label>
              <select value={motoristaId} onChange={(e) => setMotoristaId(e.target.value)} disabled={finalizada}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm disabled:bg-slate-100">
                <option value="">Selecione...</option>
                {motoristas.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Veículo</label>
              <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)} disabled={finalizada}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm disabled:bg-slate-100">
                <option value="">Selecione...</option>
                {veiculos.map((v) => <option key={v.id} value={v.id}>{v.placa} — {v.modelo}</option>)}
              </select>
            </div>
            <button type="submit" disabled={finalizada}
              className="w-full rounded bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50">
              Atribuir motorista e veículo
            </button>
          </form>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            <button
              onClick={() => executar(() => coletaService.coletar(id))}
              disabled={!podeColetar}
              title={!podeColetar ? "É necessário atribuir motorista e veículo (Em Coleta)" : ""}
              className="w-full rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Marcar como coletada
            </button>
            <button
              onClick={() => executar(() => coletaService.cancelar(id))}
              disabled={finalizada}
              className="w-full rounded border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Cancelar coleta
            </button>
          </div>
        </div>
      </div>

      {/* Ocorrências */}
      <div className={cardClass}>
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Ocorrências</h2>

        <form onSubmit={handleOcorrencia} className="mb-4 flex gap-2">
          <input
            value={descricaoOcorrencia}
            onChange={(e) => setDescricaoOcorrencia(e.target.value)}
            placeholder="Descreva a ocorrência (ex.: remetente ausente)"
            className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Registrar
          </button>
        </form>

        {coleta.ocorrencias.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma ocorrência registrada.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {coleta.ocorrencias.map((o) => (
              <li key={o.id} className="py-2">
                <p className="text-sm text-slate-700">{o.descricao}</p>
                <p className="text-xs text-slate-400">
                  {formatarData(o.dataHora)} — por {o.registradoPor}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
