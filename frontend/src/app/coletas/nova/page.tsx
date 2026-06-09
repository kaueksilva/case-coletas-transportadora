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

  const inputClass = "w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Nova solicitação de coleta</h1>
      <p className="mb-6 text-sm text-slate-500">
        Informe os dados do remetente, destinatário, data e prioridade.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className={labelClass}>Cliente</label>
          <input required value={form.cliente} onChange={(e) => atualizar("cliente", e.target.value)} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Remetente</label>
            <input required value={form.remetenteNome} onChange={(e) => atualizar("remetenteNome", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Endereço do remetente</label>
            <input required value={form.remetenteEndereco} onChange={(e) => atualizar("remetenteEndereco", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Destinatário</label>
            <input required value={form.destinatarioNome} onChange={(e) => atualizar("destinatarioNome", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Endereço do destinatário</label>
            <input required value={form.destinatarioEndereco} onChange={(e) => atualizar("destinatarioEndereco", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Data/hora da coleta</label>
            <input required type="datetime-local" value={form.dataColeta} onChange={(e) => atualizar("dataColeta", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Prioridade</label>
            <select value={form.prioridade} onChange={(e) => atualizar("prioridade", e.target.value)} className={inputClass}>
              <option value={Prioridade.Baixa}>Baixa</option>
              <option value={Prioridade.Media}>Média</option>
              <option value={Prioridade.Alta}>Alta</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Observações</label>
          <textarea value={form.observacoes} onChange={(e) => atualizar("observacoes", e.target.value)} rows={3} className={inputClass} />
        </div>

        {erro && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.push("/")} className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Cancelar
          </button>
          <button type="submit" disabled={salvando} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {salvando ? "Salvando..." : "Registrar coleta"}
          </button>
        </div>
      </form>
    </div>
  );
}
