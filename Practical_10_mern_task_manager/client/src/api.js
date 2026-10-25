const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
        throw new Error(data.error || `HTTP ${response.status}`);
    return data;
}
export const getTasks = () => request('/tasks');
export const createTask = title => request('/tasks', { method: 'POST', body: JSON.stringify({ title }) });
export const toggleTask = (id, done) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ done }) });
export const deleteTask = id => request(`/tasks/${id}`, { method: 'DELETE' });
