import { Prioridade, StatusColeta } from "@/lib/types";

const statusCores: Record<StatusColeta, string> = {
  [StatusColeta.Aberta]: "bg-amber-50 text-amber-700 border-amber-200",
  [StatusColeta.EmColeta]: "bg-blue-50 text-blue-700 border-blue-200",
  [StatusColeta.Coletada]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [StatusColeta.Cancelada]: "bg-slate-100 text-slate-600 border-slate-200",
};

export function StatusBadge({ status, descricao }: { status: StatusColeta; descricao: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${statusCores[status]}`}
    >
      {descricao}
    </span>
  );
}

const prioridadeCores: Record<Prioridade, string> = {
  [Prioridade.Baixa]: "bg-slate-100 text-slate-600 border-slate-200",
  [Prioridade.Media]: "bg-sky-50 text-sky-700 border-sky-200",
  [Prioridade.Alta]: "bg-rose-50 text-rose-700 border-rose-200",
};

export function PrioridadeBadge({
  prioridade,
  descricao,
}: {
  prioridade: Prioridade;
  descricao: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${prioridadeCores[prioridade]}`}
    >
      {prioridade === Prioridade.Alta ? "⚑ " : ""}
      {descricao}
    </span>
  );
}
