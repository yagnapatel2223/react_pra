require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting' }));
app.get('/api/employees', async (req, res, next) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json({ count: employees.length, data: employees });
    }
    catch (e) {
        next(e);
    }
});
app.get('/api/employees/:id', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid employee id' });
        const item = await Employee.findById(req.params.id);
        if (!item)
            return res.status(404).json({ error: 'Employee not found' });
        res.json(item);
    }
    catch (e) {
        next(e);
    }
});
app.post('/api/employees', async (req, res, next) => {
    try {
        const item = await Employee.create(req.body);
        res.status(201).json(item);
    }
    catch (e) {
        if (e.code === 11000)
            return res.status(409).json({ error: 'Email already exists' });
        next(e);
    }
});
app.put('/api/employees/:id', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid employee id' });
        const item = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item)
            return res.status(404).json({ error: 'Employee not found' });
        res.json(item);
    }
    catch (e) {
        if (e.code === 11000)
            return res.status(409).json({ error: 'Email already exists' });
        next(e);
    }
});
app.delete('/api/employees/:id', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid employee id' });
        const item = await Employee.findByIdAndDelete(req.params.id);
        if (!item)
            return res.status(404).json({ error: 'Employee not found' });
        res.json({ message: 'Employee deleted', data: item });
    }
    catch (e) {
        next(e);
    }
});
app.use((err, req, res, next) => {
    console.error(err.message);
    if (err.name === 'ValidationError')
        return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Internal server error' });
});
async function start() {
    if (!process.env.MONGODB_URI)
        throw new Error('Set MONGODB_URI in .env');
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`Employee API listening on http://localhost:${PORT}`));
}
start().catch(e => { console.error('Startup failed:', e.message); process.exit(1); });
