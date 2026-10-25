require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const app = express();
const PORT = process.env.PORT || 4003;
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use((err, req, res, next) => {
    console.error(err.message);
    if (err instanceof multerError())
        return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ error: err.message });
    if (err.message === 'Unsupported file type')
        return res.status(400).json({ error: err.message });
    if (err.code === 11000)
        return res.status(409).json({ error: 'Duplicate value' });
    if (err.name === 'ValidationError')
        return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Server error' });
});
function multerError() {
    try {
        return require('multer').MulterError;
    }
    catch {
        return class NoMulterError {
        };
    }
}
async function start() {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET)
        throw new Error('Set MONGODB_URI and JWT_SECRET in .env');
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`Document manager on http://localhost:${PORT}`));
}
start().catch(e => { console.error(e.message); process.exit(1); });
