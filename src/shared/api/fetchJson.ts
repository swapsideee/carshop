export async function fetchJson(url, init) {
  const res = await fetch(url, init);

  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status}`);
    err.status = res.status;
    err.url = url;
    throw err;
  }

  return res.json();
}
