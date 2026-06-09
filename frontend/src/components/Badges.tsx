import { Prioridade, StatusColeta } from "@/lib/types";

const statusCores: Record<StatusColeta, string> = {
  [StatusColeta.Aberta]: "bg-amber-100 text-amber-800 border-amber-300",
  [StatusColeta.EmColeta]: "bg-blue-100 text-blue-800 border-blue-300",
  [StatusColeta.Coletada]: "bg-green-100 text-green-800 border-green-300",
  [StatusColeta.Cancelada]: "bg-slate-200 text-slate-600 border-slate-300",
};

export function StatusBadge({ status, descricao }: { status: StatusColeta; descricao: string }) {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusCores[status]}`}>
      {descricao}
    </span>
  );
}

const prioridadeCores: Record<Prioridade, string> = {
  [Prioridade.Baixa]: "bg-slate-100 text-slate-600 border-slate-300",
  [Prioridade.Media]: "bg-sky-100 text-sky-800 border-sky-300",
  [Prioridade.Alta]: "bg-red-100 text-red-800 border-red-300",
};

export function PrioridadeBadge({ prioridade, descricao }: { prioridade: Prioridade; descricao: string }) {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${prioridadeCores[prioridade]}`}>
      {prioridade === Prioridade.Alta ? "⚠ " : ""}
      {descricao}
    </span>
  );
}
