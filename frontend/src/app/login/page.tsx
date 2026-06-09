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
    <div className="mx-auto mt-10 max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Entrar</h1>
      <p className="mb-6 text-sm text-slate-500">
        Acesse o painel de gestão de coletas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {erro && (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 rounded bg-slate-50 p-3 text-xs text-slate-500">
        <p className="font-medium text-slate-600">Usuários de teste (seed):</p>
        <p>admin@coletas.com / Admin@123</p>
        <p>operador@coletas.com / Operador@123</p>
      </div>
    </div>
  );
}
