"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@coletas.com");
  const [senha, setSenha] = useState("Admin@123");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await login(email, senha);
      router.push("/");
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Falha ao entrar.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-11rem)] max-w-6xl items-center">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center rounded-3xl border border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.25)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
            Gestão operacional
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Controle cada coleta com mais clareza e agilidade.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Acompanhe status, ocorrências, motoristas e veículos em uma interface mais limpa e
            moderna.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Acesso rápido</p>
              <p className="mt-2 text-sm text-slate-100">Login otimizado para operação diária.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Rastreabilidade</p>
              <p className="mt-2 text-sm text-slate-100">Histórico e status em um único fluxo.</p>
            </div>
          </div>
        </div>

        <div className="app-card-solid p-8 shadow-[0_25px_80px_rgba(15,23,42,0.12)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Entrar
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Acesse o painel
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use suas credenciais para acessar o acompanhamento das coletas.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="app-label">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="app-input"
              />
            </div>
            <div>
              <label className="app-label">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="app-input"
              />
            </div>

            {erro && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </p>
            )}

            <button type="submit" disabled={carregando} className="app-button-primary w-full">
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-700">Usuários de teste (seed)</p>
            <p className="mt-2">admin@coletas.com / Admin@123</p>
            <p>operador@coletas.com / Operador@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
