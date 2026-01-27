export type FetchJsonError = Error & {
  status?: number;
  url?: string;
};

export async function fetchJson<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    const err: FetchJsonError = new Error(`Request failed: ${res.status}`);
    err.status = res.status;
    err.url = url;
    throw err;
  }

  return (await res.json()) as T;
}
