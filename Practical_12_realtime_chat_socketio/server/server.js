const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4002;
const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', methods: ['GET', 'POST'] } });
app.use(cors());
app.get('/api/health', (req, res) => res.json({ status: 'ok', connectedClients: io.engine.clientsCount }));
io.on('connection', socket => {
    console.log('Connected:', socket.id);
    socket.on('chat:message', payload => {
        const user = String(payload?.user || 'Guest').trim().slice(0, 30) || 'Guest';
        const text = String(payload?.text || '').trim().slice(0, 500);
        if (!text)
            return;
        io.emit('chat:message', { id: socket.id + '-' + Date.now(), user, text, at: new Date().toISOString() });
    });
    socket.on('disconnect', reason => console.log('Disconnected:', socket.id, reason));
});
server.listen(PORT, () => console.log(`Socket chat server on http://localhost:${PORT}`));
