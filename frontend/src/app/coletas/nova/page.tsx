"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedPage } from "@/components/ProtectedPage";
import { coletaService } from "@/lib/services";
import { Prioridade } from "@/lib/types";
import { ApiError } from "@/lib/api";

export default function NovaColetaPage() {
  return (
    <ProtectedPage>
      <NovaColeta />
    </ProtectedPage>
  );
}

function NovaColeta() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState({
    cliente: "",
    remetenteNome: "",
    remetenteEndereco: "",
    destinatarioNome: "",
    destinatarioEndereco: "",
    dataColeta: "",
    prioridade: String(Prioridade.Media),
    observacoes: "",
  });

  function atualizar(campo: string, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      const coleta = await coletaService.criar({
        cliente: form.cliente,
        remetenteNome: form.remetenteNome,
        remetenteEndereco: form.remetenteEndereco,
        destinatarioNome: form.destinatarioNome,
        destinatarioEndereco: form.destinatarioEndereco,
        dataColeta: new Date(form.dataColeta).toISOString(),
        prioridade: Number(form.prioridade) as Prioridade,
        observacoes: form.observacoes || undefined,
      });
      router.push(`/coletas/${coleta.id}`);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro ao criar coleta.");
      setSalvando(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Operação</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Nova solicitação de coleta
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Informe os dados do remetente, destinatário, data e prioridade.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 app-panel">
        <div>
          <label className="app-label">Cliente</label>
          <input
            required
            value={form.cliente}
            onChange={(e) => atualizar("cliente", e.target.value)}
            className="app-input"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="app-label">Remetente</label>
            <input
              required
              value={form.remetenteNome}
              onChange={(e) => atualizar("remetenteNome", e.target.value)}
              className="app-input"
            />
          </div>
          <div>
            <label className="app-label">Endereço do remetente</label>
            <input
              required
              value={form.remetenteEndereco}
              onChange={(e) => atualizar("remetenteEndereco", e.target.value)}
              className="app-input"
            />
          </div>
          <div>
            <label className="app-label">Destinatário</label>
            <input
              required
              value={form.destinatarioNome}
              onChange={(e) => atualizar("destinatarioNome", e.target.value)}
              className="app-input"
            />
          </div>
          <div>
            <label className="app-label">Endereço do destinatário</label>
            <input
              required
              value={form.destinatarioEndereco}
              onChange={(e) => atualizar("destinatarioEndereco", e.target.value)}
              className="app-input"
            />
          </div>
          <div>
            <label className="app-label">Data/hora da coleta</label>
            <input
              required
              type="datetime-local"
              value={form.dataColeta}
              onChange={(e) => atualizar("dataColeta", e.target.value)}
              className="app-input"
            />
          </div>
          <div>
            <label className="app-label">Prioridade</label>
            <select
              value={form.prioridade}
              onChange={(e) => atualizar("prioridade", e.target.value)}
              className="app-input"
            >
              <option value={Prioridade.Baixa}>Baixa</option>
              <option value={Prioridade.Media}>Média</option>
              <option value={Prioridade.Alta}>Alta</option>
            </select>
          </div>
        </div>

        <div>
          <label className="app-label">Observações</label>
          <textarea
            value={form.observacoes}
            onChange={(e) => atualizar("observacoes", e.target.value)}
            rows={4}
            className="app-input resize-none"
          />
        </div>

        {erro && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.push("/")} className="app-button-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={salvando} className="app-button-primary">
            {salvando ? "Salvando..." : "Registrar coleta"}
          </button>
        </div>
      </form>
    </div>
  );
}
