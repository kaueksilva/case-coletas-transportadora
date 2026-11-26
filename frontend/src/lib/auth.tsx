"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { obterToken, removerToken, salvarToken } from "./api";
import { authService } from "./services";
import { AuthResponse } from "./types";

interface UsuarioLogado {
  nome: string;
  email: string;
  perfil: string;
}

interface AuthContextValue {
  usuario: UsuarioLogado | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const USER_KEY = "coletas.usuario";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = obterToken();
    const dados = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null;
    if (token && dados) setUsuario(JSON.parse(dados));
    setCarregando(false);
  }, []);

  async function login(email: string, senha: string) {
    const resp: AuthResponse = await authService.login(email, senha);
    salvarToken(resp.token);
    const u = { nome: resp.nome, email: resp.email, perfil: resp.perfil };
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUsuario(u);
  }

  function logout() {
    removerToken();
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
