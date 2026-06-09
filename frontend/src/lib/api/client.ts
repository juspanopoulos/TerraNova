const DEFAULT_API_BASE_URL = "http://localhost:8080/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object | null;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

function apiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const baseUrl = configured?.trim() || DEFAULT_API_BASE_URL;
  return baseUrl.replace(/\/+$/, "");
}

function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl()}${normalizedPath}`;
}

function isJsonBody(body: RequestOptions["body"]): body is object {
  return Boolean(body) && typeof body === "object" && !(body instanceof FormData);
}

async function readErrorMessage(response: Response) {
  try {
    const text = await response.text();
    if (!text) return response.statusText || "Erro ao consultar a API.";
    const parsed = JSON.parse(text) as { mensagem?: string; message?: string; erro?: string };
    return parsed.mensagem ?? parsed.message ?? parsed.erro ?? text;
  } catch {
    return response.statusText || "Erro ao consultar a API.";
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...init } = options;
  const jsonBody = isJsonBody(body);
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (jsonBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      ...init,
      body: jsonBody ? JSON.stringify(body) : body,
      headers: requestHeaders,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiRequestError(error.message, 0);
    }
    throw new ApiRequestError("Nao foi possivel conectar com a API.", 0);
  }

  if (!response.ok) {
    throw new ApiRequestError(await readErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
