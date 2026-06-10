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
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="app-card px-6 py-4 text-sm text-slate-600 shadow-lg">
          Carregando...
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="app-card px-6 py-4 text-sm text-slate-600 shadow-lg">
          Redirecionando para o login...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
