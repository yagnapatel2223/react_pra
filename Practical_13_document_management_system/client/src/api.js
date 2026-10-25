const API = import.meta.env.VITE_API_URL || 'http://localhost:4003/api';
export async function api(path, { token, ...opts } = {}) {
    const r = await fetch(`${API}${path}`, { ...opts, headers: { ...(opts.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) } });
    const data = r.headers.get('content-type')?.includes('application/json') ? await r.json() : null;
    if (!r.ok)
        throw new Error(data?.error || `HTTP ${r.status}`);
    return data;
}
export function downloadUrl(id) { return `${API}/documents/${id}/download`; }
