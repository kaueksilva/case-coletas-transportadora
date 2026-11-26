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

  if (carregando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="app-card px-6 py-4 text-sm text-slate-600 shadow-lg">Carregando...</div>
      </div>
    );
  }

  if (!coleta) return <p className="text-red-600">{erro ?? "Coleta não encontrada."}</p>;

  const finalizada = coleta.status === StatusColeta.Coletada || coleta.status === StatusColeta.Cancelada;
  const podeColetar = coleta.status === StatusColeta.EmColeta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white">
          ← Voltar
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Detalhes da coleta
          </p>
          <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-slate-900">
            {coleta.numero}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{coleta.cliente}</p>
        </div>
        <div className="flex items-center gap-2">
          <PrioridadeBadge prioridade={coleta.prioridade} descricao={coleta.prioridadeDescricao} />
          <StatusBadge status={coleta.status} descricao={coleta.statusDescricao} />
        </div>
      </div>

      {erro && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="app-panel lg:col-span-2">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Dados da coleta
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Remetente
              </p>
              <p className="mt-2 font-medium text-slate-900">{coleta.remetenteNome}</p>
              <p className="mt-1 text-sm text-slate-500">{coleta.remetenteEndereco}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Destinatário
              </p>
              <p className="mt-2 font-medium text-slate-900">{coleta.destinatarioNome}</p>
              <p className="mt-1 text-sm text-slate-500">{coleta.destinatarioEndereco}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Data da coleta
              </p>
              <p className="mt-2 text-slate-700">{formatarData(coleta.dataColeta)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Criada em
              </p>
              <p className="mt-2 text-slate-700">{formatarData(coleta.criadoEm)}</p>
            </div>
            {coleta.observacoes && (
              <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Observações
                </p>
                <p className="mt-2 text-slate-600">{coleta.observacoes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="app-panel">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Operação
          </h2>

          <form onSubmit={handleAtribuir} className="space-y-3">
            <div>
              <label className="app-label">Motorista</label>
              <select
                value={motoristaId}
                onChange={(e) => setMotoristaId(e.target.value)}
                disabled={finalizada}
                className="app-input"
              >
                <option value="">Selecione...</option>
                {motoristas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="app-label">Veículo</label>
              <select
                value={veiculoId}
                onChange={(e) => setVeiculoId(e.target.value)}
                disabled={finalizada}
                className="app-input"
              >
                <option value="">Selecione...</option>
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} — {v.modelo}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={finalizada} className="app-button-primary w-full">
              Atribuir motorista e veículo
            </button>
          </form>

          <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
            <button
              onClick={() => executar(() => coletaService.coletar(id))}
              disabled={!podeColetar}
              title={!podeColetar ? "É necessário atribuir motorista e veículo (Em Coleta)" : ""}
              className="app-button-primary w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
            >
              Marcar como coletada
            </button>
            <button
              onClick={() => executar(() => coletaService.cancelar(id))}
              disabled={finalizada}
              className="app-button-danger w-full"
            >
              Cancelar coleta
            </button>
          </div>
        </div>
      </div>

      <div className="app-panel">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Ocorrências
        </h2>

        <form onSubmit={handleOcorrencia} className="mb-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={descricaoOcorrencia}
            onChange={(e) => setDescricaoOcorrencia(e.target.value)}
            placeholder="Descreva a ocorrência (ex.: remetente ausente)"
            className="app-input flex-1"
          />
          <button type="submit" className="app-button-primary">
            Registrar
          </button>
        </form>

        {coleta.ocorrencias.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma ocorrência registrada.</p>
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-slate-100 divide-y divide-slate-100">
            {coleta.ocorrencias.map((o) => (
              <li key={o.id} className="bg-white px-4 py-4">
                <p className="text-sm font-medium text-slate-800">{o.descricao}</p>
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
