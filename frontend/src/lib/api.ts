// Cliente HTTP simples para consumir a API de coletas.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

const TOKEN_KEY = "coletas.token";

export function salvarToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}

export function obterToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removerToken() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = obterToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (resp.status === 401) {
    removerToken();
    throw new ApiError(401, "Sessão expirada. Faça login novamente.");
  }

  if (!resp.ok) {
    let mensagem = `Erro ${resp.status}`;
    try {
      const data = await resp.json();
      mensagem = data?.erro ?? mensagem;
    } catch {
      // resposta sem corpo JSON
    }
    throw new ApiError(resp.status, mensagem);
  }

  if (resp.status === 204) return undefined as T;

  const texto = await resp.text();
  return texto ? (JSON.parse(texto) as T) : (undefined as T);
}
