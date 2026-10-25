const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Document = require('../models/Document');
const { auth } = require('../middleware/auth');
const router = express.Router();
const DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(DIR, { recursive: true });
const allowed = new Set(['application/pdf', 'image/png', 'image/jpeg', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']);
const storage = multer.diskStorage({ destination: (req, file, cb) => cb(null, DIR), filename: (req, file, cb) => cb(null, crypto.randomUUID() + path.extname(file.originalname).toLowerCase()) });
const upload = multer({ storage, limits: { fileSize: (Number(process.env.MAX_FILE_MB) || 10) * 1024 * 1024, files: 1 }, fileFilter: (req, file, cb) => allowed.has(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported file type')) });
router.get('/', auth, async (req, res, next) => {
    try {
        const filter = {};
        if (req.user.role !== 'admin')
            filter.owner = req.user._id;
        if (req.query.q)
            filter.$or = [{ title: { $regex: String(req.query.q).slice(0, 80), $options: 'i' } }, { originalName: { $regex: String(req.query.q).slice(0, 80), $options: 'i' } }, { category: { $regex: String(req.query.q).slice(0, 50), $options: 'i' } }];
        res.json(await Document.find(filter).sort({ createdAt: -1 }).populate('owner', 'name email').limit(200));
    }
    catch (e) {
        next(e);
    }
});
router.post('/', auth, upload.single('file'), async (req, res, next) => {
    if (!req.file)
        return res.status(400).json({ error: 'Select a file' });
    try {
        const title = String(req.body.title || req.file.originalname).trim();
        if (!title || title.length > 150) {
            fs.unlink(req.file.path, () => { });
            return res.status(400).json({ error: 'Title is required and must be under 150 characters' });
        }
        const doc = await Document.create({ title, description: String(req.body.description || '').slice(0, 1000), category: String(req.body.category || 'General').slice(0, 50), originalName: path.basename(req.file.originalname).slice(0, 180), storedName: req.file.filename, mimeType: req.file.mimetype, size: req.file.size, owner: req.user._id });
        res.status(201).json(doc);
    }
    catch (e) {
        fs.unlink(req.file.path, () => { });
        next(e);
    }
});
router.get('/:id/download', auth, async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid document id' });
        const doc = await Document.findById(req.params.id);
        if (!doc)
            return res.status(404).json({ error: 'Document not found' });
        if (req.user.role !== 'admin' && doc.owner.toString() !== req.user._id.toString())
            return res.status(403).json({ error: 'Access denied' });
        const full = path.join(DIR, doc.storedName);
        if (!fs.existsSync(full))
            return res.status(404).json({ error: 'Stored file is missing' });
        res.download(full, doc.originalName);
    }
    catch (e) {
        next(e);
    }
});
router.delete('/:id', auth, async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid document id' });
        const doc = await Document.findById(req.params.id);
        if (!doc)
            return res.status(404).json({ error: 'Document not found' });
        if (req.user.role !== 'admin' && doc.owner.toString() !== req.user._id.toString())
            return res.status(403).json({ error: 'Access denied' });
        await doc.deleteOne();
        fs.unlink(path.join(DIR, doc.storedName), () => { });
        res.json({ message: 'Document deleted' });
    }
    catch (e) {
        next(e);
    }
});
module.exports = router;
