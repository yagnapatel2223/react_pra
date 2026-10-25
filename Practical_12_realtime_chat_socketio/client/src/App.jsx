import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
const SERVER = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4002';
export default function App() {
    const [user, setUser] = useState('Guest');
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('Connecting...');
    const socketRef = useRef(null);
    const bottom = useRef(null);
    useEffect(() => { const socket = io(SERVER); socketRef.current = socket; socket.on('connect', () => setStatus('Connected to live chat')); socket.on('disconnect', () => setStatus('Reconnecting...')); socket.on('connect_error', () => setStatus('Cannot connect - start the chat server first')); socket.on('chat:message', m => setMessages(old => [...old, m].slice(-100))); return () => socket.disconnect(); }, []);
    useEffect(() => bottom.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);
    function send(e) {
        e.preventDefault();
        const value = text.trim();
        if (!value)
            return;
        socketRef.current?.emit('chat:message', { user: user.trim() || 'Guest', text: value });
        setText('');
    }
    return <main className="app"><header className="hero"><span className="pill">SOCKET.IO LAB</span><h1>Live Chat</h1><p>Open this page in two browser windows to test live messaging.</p></header><section className="card"><div className="row" style={{ justifyContent: 'space-between' }}><div><strong>Community room</strong><p className="muted small">Messages are temporary and not stored.</p></div><span className="pill">{status}</span></div><div style={{ height: 350, overflowY: 'auto', background: '#f6f8fc', padding: 14, borderRadius: 12, margin: '14px 0' }}>{messages.map(m => <article key={m.id} style={{ background: 'white', border: '1px solid #e4eaf3', padding: 12, borderRadius: 10, marginBottom: 10 }}><div className="row" style={{ justifyContent: 'space-between' }}><strong>{m.user}</strong><span className="muted small">{new Date(m.at).toLocaleTimeString()}</span></div><p style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{m.text}</p></article>)}<div ref={bottom}/></div><div className="field"><label>Your display name</label><input value={user} onChange={e => setUser(e.target.value)} maxLength="30"/></div><form className="row" onSubmit={send}><input aria-label="Message" value={text} onChange={e => setText(e.target.value)} maxLength="500" placeholder="Write a message..." style={{ flex: 1, minWidth: 180, padding: 12, border: '1px solid #d4ddeb', borderRadius: 9 }}/><button className="btn">Send</button></form></section></main>;
}
