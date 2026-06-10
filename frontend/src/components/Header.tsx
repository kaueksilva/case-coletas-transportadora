"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { usuario, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="app-shell flex items-center justify-between py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition group-hover:-translate-y-0.5">
            C
          </span>
          <span className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Coletas
            </span>
            <span className="text-base font-semibold text-slate-900">
              Gestão de Transporte
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {usuario ? (
            <>
              <Link
                href="/"
                className="rounded-2xl px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Acompanhamento
              </Link>
              <Link
                href="/coletas/nova"
                className="rounded-2xl px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Nova coleta
              </Link>
              <span className="hidden h-8 w-px bg-slate-200 md:block" />
              <span className="hidden rounded-2xl bg-slate-100 px-4 py-2 text-slate-600 md:inline-flex">
                {usuario.nome} ({usuario.perfil})
              </span>
              <button onClick={logout} className="app-button-secondary px-4 py-2">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="app-button-primary px-4 py-2">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
