require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.get('/api/tasks', async (req, res, next) => {
    try {
        res.json(await Task.find().sort({ createdAt: -1 }));
    }
    catch (e) {
        next(e);
    }
});
app.post('/api/tasks', async (req, res, next) => {
    try {
        const title = String(req.body.title || '').trim();
        if (title.length < 2)
            return res.status(400).json({ error: 'Task title must have at least 2 characters' });
        res.status(201).json(await Task.create({ title }));
    }
    catch (e) {
        next(e);
    }
});
app.patch('/api/tasks/:id', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid task id' });
        const item = await Task.findByIdAndUpdate(req.params.id, { done: Boolean(req.body.done) }, { new: true, runValidators: true });
        if (!item)
            return res.status(404).json({ error: 'Task not found' });
        res.json(item);
    }
    catch (e) {
        next(e);
    }
});
app.delete('/api/tasks/:id', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid task id' });
        const item = await Task.findByIdAndDelete(req.params.id);
        if (!item)
            return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task removed' });
    }
    catch (e) {
        next(e);
    }
});
app.use((e, req, res, next) => { console.error(e); res.status(500).json({ error: 'Server error' }); });
async function start() {
    if (!process.env.MONGODB_URI)
        throw new Error('Set MONGODB_URI in .env');
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`Task API on http://localhost:${PORT}`));
}
start().catch(e => { console.error(e.message); process.exit(1); });
