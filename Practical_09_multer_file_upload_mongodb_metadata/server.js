require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const FileRecord = require('./models/FileRecord');
const app = express();
const PORT = process.env.PORT || 3003;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const allowed = new Set(['application/pdf', 'image/png', 'image/jpeg', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
const storage = multer.diskStorage({ destination: (req, file, cb) => cb(null, UPLOAD_DIR), filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`) });
const upload = multer({ storage, limits: { fileSize: (Number(process.env.MAX_FILE_MB) || 5) * 1024 * 1024, files: 1 }, fileFilter: (req, file, cb) => allowed.has(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported file type. Use PDF, PNG, JPG, TXT, DOC or DOCX.')) });
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/files', async (req, res, next) => {
    try {
        res.json(await FileRecord.find().sort({ uploadedAt: -1 }).limit(50).lean());
    }
    catch (e) {
        next(e);
    }
});
app.post('/api/files', upload.single('file'), async (req, res, next) => {
    if (!req.file)
        return res.status(400).json({ error: 'Choose a file first' });
    try {
        const record = await FileRecord.create({ originalName: path.basename(req.file.originalname).slice(0, 180), storedName: req.file.filename, mimeType: req.file.mimetype, size: req.file.size });
        res.status(201).json(record);
    }
    catch (e) {
        fs.unlink(req.file.path, () => { });
        next(e);
    }
});
app.get('/api/files/:id/download', async (req, res, next) => {
    try {
        const f = await FileRecord.findById(req.params.id);
        if (!f)
            return res.status(404).json({ error: 'File not found' });
        const full = path.join(UPLOAD_DIR, f.storedName);
        if (!fs.existsSync(full))
            return res.status(404).json({ error: 'Stored file is missing' });
        res.download(full, f.originalName);
    }
    catch (e) {
        next(e);
    }
});
app.use((err, req, res, next) => {
    console.error(err.message);
    if (err instanceof multer.MulterError)
        return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ error: err.message });
    if (err.message.startsWith('Unsupported file type'))
        return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Internal server error' });
});
async function start() {
    if (!process.env.MONGODB_URI)
        throw new Error('Set MONGODB_URI in .env');
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`Upload app at http://localhost:${PORT}`));
}
start().catch(e => { console.error('Startup failed:', e.message); process.exit(1); });
