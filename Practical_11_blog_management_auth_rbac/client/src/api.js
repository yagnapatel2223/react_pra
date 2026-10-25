const API = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
export async function api(path, { token, ...options } = {}) {
    const r = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
    const data = await r.json().catch(() => ({}));
    if (!r.ok)
        throw new Error(data.error || `HTTP ${r.status}`);
    return data;
}
