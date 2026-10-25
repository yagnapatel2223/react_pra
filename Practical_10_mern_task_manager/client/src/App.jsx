import { useEffect, useState } from 'react';
import { getTasks, createTask, toggleTask, deleteTask } from './api.js';
export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('Connecting to API...');
    const [busy, setBusy] = useState(false);
    async function load() {
        try {
            setTasks(await getTasks());
            setStatus('Connected. Changes are saved to MongoDB.');
        }
        catch (e) {
            setStatus(e.message + ' Check that the backend is running and .env is configured.');
        }
    }
    useEffect(() => { load(); }, []);
    async function add(e) {
        e.preventDefault();
        if (title.trim().length < 2)
            return setStatus('Enter at least 2 characters.');
        setBusy(true);
        try {
            const item = await createTask(title.trim());
            setTasks(old => [item, ...old]);
            setTitle('');
            setStatus('Task created.');
        }
        catch (e) {
            setStatus(e.message);
        }
        finally {
            setBusy(false);
        }
    }
    async function toggle(t) {
        try {
            const updated = await toggleTask(t._id, !t.done);
            setTasks(old => old.map(x => x._id === updated._id ? updated : x));
        }
        catch (e) {
            setStatus(e.message);
        }
    }
    async function remove(t) {
        try {
            await deleteTask(t._id);
            setTasks(old => old.filter(x => x._id !== t._id));
        }
        catch (e) {
            setStatus(e.message);
        }
    }
    return <main className="app"><header className="hero"><span className="pill">MERN MINI APP</span><h1>TaskFlow</h1><p>React + Express + MongoDB</p></header><section className="card"><form className="row" onSubmit={add}><input aria-label="New task" value={title} onChange={e => setTitle(e.target.value)} placeholder="Add a task..." style={{ flex: 1, minWidth: 180, padding: 12, border: '1px solid #d4ddeb', borderRadius: 9 }}/><button className="btn" disabled={busy}>Add task</button></form><p className="muted" role="status">{status}</p></section><section className="list" style={{ marginTop: 18 }}>{tasks.map(t => <article className="card row" key={t._id} style={{ justifyContent: 'space-between' }}><label style={{ display: 'flex', gap: 10, alignItems: 'center', textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#8290a5' : 'inherit' }}><input type="checkbox" checked={t.done} onChange={() => toggle(t)}/>{t.title}</label><button className="btn danger" onClick={() => remove(t)}>Delete</button></article>)}</section></main>;
}
