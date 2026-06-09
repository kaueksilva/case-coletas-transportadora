"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/// Garante que apenas usuários autenticados acessem o conteúdo.
export function ProtectedPage({ children }: { children: ReactNode }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) router.replace("/login");
  }, [carregando, usuario, router]);

  if (carregando) {
    return <p className="text-slate-500">Carregando...</p>;
  }

  if (!usuario) {
    return <p className="text-slate-500">Redirecionando para o login...</p>;
  }

  return <>{children}</>;
}
