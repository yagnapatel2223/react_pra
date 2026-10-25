import { useEffect, useState } from 'react';
import { api } from './api.js';
export default function App() {
    const [auth, setAuth] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('blog-auth'));
        }
        catch {
            return null;
        }
    });
    const [posts, setPosts] = useState([]);
    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [editing, setEditing] = useState(null);
    const [status, setStatus] = useState('');
    async function load() {
        try {
            setPosts(await api('/posts'));
        }
        catch (e) {
            setStatus(e.message);
        }
    }
    useEffect(() => { load(); }, []);
    async function submitAuth(e) {
        e.preventDefault();
        try {
            const data = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify({ name, email, password }) });
            localStorage.setItem('blog-auth', JSON.stringify(data));
            setAuth(data);
            setStatus(`Signed in as ${data.user.role}.`);
            setPassword('');
        }
        catch (e) {
            setStatus(e.message);
        }
    }
    function logout() { localStorage.removeItem('blog-auth'); setAuth(null); setStatus('Signed out.'); }
    function edit(p) { setEditing(p._id); setTitle(p.title); setBody(p.body); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    async function savePost(e) {
        e.preventDefault();
        try {
            const data = await api(editing ? `/posts/${editing}` : '/posts', { token: auth?.token, method: editing ? 'PUT' : 'POST', body: JSON.stringify({ title, body }) });
            setPosts(old => editing ? old.map(p => p._id === data._id ? data : p) : [data, ...old]);
            setTitle('');
            setBody('');
            setEditing(null);
            setStatus('Post saved.');
        }
        catch (e) {
            setStatus(e.message);
        }
    }
    async function remove(p) {
        try {
            await api(`/posts/${p._id}`, { token: auth?.token, method: 'DELETE' });
            setPosts(old => old.filter(x => x._id !== p._id));
            setStatus('Post deleted.');
        }
        catch (e) {
            setStatus(e.message);
        }
    }
    return <main className="app"><header className="hero"><span className="pill">BLOG STUDIO</span><h1>Stories & Ideas</h1><p>Publish, edit and manage posts with authenticated roles.</p></header><div className="grid" style={{ gridTemplateColumns: 'minmax(270px,.7fr) minmax(350px,1.3fr)' }}><aside className="card">{auth ? <><h2>Account</h2><p>{auth.user.name}</p><span className="pill">{auth.user.role}</span><p className="small muted">The server checks the role and post ownership for every write.</p><button className="btn secondary" onClick={logout}>Sign out</button></> : <><h2>{mode === 'login' ? 'Sign in' : 'Create author account'}</h2><form onSubmit={submitAuth}>{mode === 'register' && <div className="field"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} required/></div>}<div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required/></div><div className="field"><label>Password (8+ characters)</label><input type="password" minLength="8" value={password} onChange={e => setPassword(e.target.value)} required/></div><button className="btn">{mode === 'login' ? 'Sign in' : 'Register'}</button></form><p className="small"><button className="btn secondary" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}</button></p></>}</aside><section><form className="card" onSubmit={savePost}><h2>{editing ? 'Edit post' : 'Create a post'}</h2><div className="field"><label>Title</label><input value={title} onChange={e => setTitle(e.target.value)} minLength="3" required/></div><div className="field"><label>Content</label><textarea rows="5" value={body} onChange={e => setBody(e.target.value)} required/></div><div className="row"><button className="btn" disabled={!auth}>{editing ? 'Update post' : 'Publish post'}</button>{editing && <button type="button" className="btn secondary" onClick={() => { setEditing(null); setTitle(''); setBody(''); }}>Cancel edit</button>}</div></form><p className="muted" role="status">{status}</p><div className="list">{posts.map(p => <article className="card" key={p._id}><span className="pill">{p.author?.name || 'Author'}</span><h2>{p.title}</h2><p style={{ whiteSpace: 'pre-wrap' }}>{p.body}</p><p className="muted small">{new Date(p.createdAt).toLocaleString()}</p>{auth && <div className="row"><button className="btn secondary" onClick={() => edit(p)}>Edit</button><button className="btn danger" onClick={() => remove(p)}>Delete</button></div>}</article>)}</div></section></div></main>;
}
