const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const body: { data?: T; error?: { code: string; message: string } } | null = await res
    .json()
    .catch(() => null);

  if (!res.ok) {
    const err = body?.error ?? { code: "UNKNOWN_ERROR", message: "Request failed" };
    throw new ApiClientError(res.status, err.code, err.message);
  }

  return body?.data as T;
}
