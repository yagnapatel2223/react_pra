import { useEffect, useState } from 'react';
import { api, downloadUrl } from './api.js';
export default function App() {
    const [session, setSession] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('docs-session'));
        }
        catch {
            return null;
        }
    });
    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [file, setFile] = useState(null);
    const [q, setQ] = useState('');
    const [docs, setDocs] = useState([]);
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);
    async function load() {
        if (!session)
            return;
        try {
            const data = await api(`/documents?q=${encodeURIComponent(q)}`, { token: session.token });
            setDocs(data);
            setStatus(`${data.length} document(s) available.`);
        }
        catch (e) {
            setStatus(e.message);
        }
    }
    useEffect(() => { load(); }, [session]);
    async function authSubmit(e) {
        e.preventDefault();
        try {
            const data = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify({ name, email, password }) });
            localStorage.setItem('docs-session', JSON.stringify(data));
            setSession(data);
            setPassword('');
            setStatus('Signed in successfully.');
        }
        catch (e) {
            setStatus(e.message);
        }
    }
    function logout() { localStorage.removeItem('docs-session'); setSession(null); setDocs([]); }
    async function upload(e) {
        e.preventDefault();
        if (!file)
            return setStatus('Select a file first.');
        const form = new FormData();
        form.append('file', file);
        form.append('title', title || file.name);
        form.append('description', description);
        form.append('category', category);
        setBusy(true);
        try {
            await api('/documents', { token: session.token, method: 'POST', body: form });
            setFile(null);
            setTitle('');
            setDescription('');
            e.target.reset();
            setStatus('Document uploaded.');
            await load();
        }
        catch (e) {
            setStatus(e.message);
        }
        finally {
            setBusy(false);
        }
    }
    async function remove(d) {
        if (!confirm(`Delete ${d.title}?`))
            return;
        try {
            await api(`/documents/${d._id}`, { token: session.token, method: 'DELETE' });
            setDocs(old => old.filter(x => x._id !== d._id));
            setStatus('Document deleted.');
        }
        catch (e) {
            setStatus(e.message);
        }
    }
    async function search(e) { e.preventDefault(); await load(); }
    if (!session)
        return <main className="app"><header className="hero"><span className="pill">DOCPORTAL</span><h1>Document Management</h1><p>Sign in to organize and protect your work files.</p></header><section className="card" style={{ maxWidth: 520, margin: 'auto' }}><h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2><form onSubmit={authSubmit}>{mode === 'register' && <div className="field"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} required/></div>}<div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required/></div><div className="field"><label>Password (8+ characters)</label><input type="password" minLength="8" value={password} onChange={e => setPassword(e.target.value)} required/></div><button className="btn">{mode === 'login' ? 'Sign in' : 'Register'}</button></form><p><button className="btn secondary" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Create an account' : 'Back to sign in'}</button></p><p className="muted" role="status">{status}</p></section></main>;
    return <main className="app"><header className="hero"><div className="row" style={{ justifyContent: 'space-between' }}><div><span className="pill">DOCPORTAL</span><h1>My Documents</h1><p>Upload, search, download and manage your documents.</p></div><button className="btn secondary" onClick={logout}>Sign out</button></div></header><section className="card"><div className="row" style={{ justifyContent: 'space-between' }}><div><h2 style={{ marginBottom: 4 }}>Workspace</h2><p className="muted small">Signed in as {session.user.name} · {session.user.role}</p></div><span className="pill">{docs.length} files</span></div><form onSubmit={upload}><div className="grid"><div className="field"><label>Document title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Annual report"/></div><div className="field"><label>Category</label><select value={category} onChange={e => setCategory(e.target.value)}>{['General', 'Academic', 'Finance', 'Legal', 'Project', 'Personal'].map(x => <option key={x}>{x}</option>)}</select></div></div><div className="field"><label>Description</label><input value={description} onChange={e => setDescription(e.target.value)} maxLength="1000" placeholder="Optional description"/></div><div className="field"><label>Select file (PDF, image, DOC/DOCX, TXT)</label><input type="file" onChange={e => setFile(e.target.files?.[0] || null)} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt" required/></div><button className="btn" disabled={busy}>{busy ? 'Uploading...' : 'Upload document'}</button></form></section><section className="card" style={{ marginTop: 18 }}><form onSubmit={search} className="row"><input aria-label="Search documents" placeholder="Search title, filename, category..." value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, minWidth: 200, padding: 12, border: '1px solid #d4ddeb', borderRadius: 9 }}/><button className="btn secondary">Search</button><button type="button" className="btn secondary" onClick={() => { setQ(''); setTimeout(load, 0); }}>Clear</button></form><p className="muted" role="status">{status}</p><div style={{ overflowX: 'auto' }}><table className="table"><thead><tr><th>Document</th><th>Category</th><th>Size</th><th>Uploaded</th><th>Actions</th></tr></thead><tbody>{docs.map(d => <tr key={d._id}><td><strong>{d.title}</strong><br /><span className="muted small">{d.originalName}</span></td><td>{d.category}</td><td>{(d.size / 1024).toFixed(1)} KB</td><td>{new Date(d.createdAt).toLocaleDateString()}</td><td><div className="row"><a className="btn" href={downloadUrl(d._id)} onClick={async (e) => {
                e.preventDefault();
                try {
                    const r = await fetch(downloadUrl(d._id), { headers: { Authorization: `Bearer ${session.token}` } });
                    if (!r.ok)
                        throw new Error('Download failed');
                    const blob = await r.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = d.originalName;
                    a.click();
                    URL.revokeObjectURL(url);
                }
                catch (err) {
                    setStatus(err.message);
                }
            }}>Download</a><button className="btn danger" onClick={() => remove(d)}>Delete</button></div></td></tr>)}</tbody></table>{docs.length === 0 && <p className="muted">No documents match this view.</p>}</div></section><p className="muted small">Security note: this classroom starter uses local disk storage. Production systems should use managed object storage, antivirus scanning, audit trails, backup and retention policies.</p></main>;
}
