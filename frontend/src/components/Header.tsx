"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { usuario, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <span className="rounded bg-blue-600 px-2 py-1 text-sm text-white">COLETAS</span>
          <span className="hidden sm:inline">Gestão de Coletas</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {usuario ? (
            <>
              <Link href="/" className="text-slate-600 hover:text-blue-600">
                Acompanhamento
              </Link>
              <Link href="/coletas/nova" className="text-slate-600 hover:text-blue-600">
                Nova coleta
              </Link>
              <span className="hidden text-slate-400 md:inline">|</span>
              <span className="hidden text-slate-500 md:inline">
                {usuario.nome} ({usuario.perfil})
              </span>
              <button
                onClick={logout}
                className="rounded border border-slate-300 px-3 py-1 text-slate-600 hover:bg-slate-100"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="text-slate-600 hover:text-blue-600">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
