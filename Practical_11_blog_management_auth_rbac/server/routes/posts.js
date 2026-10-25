const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.get('/', async (req, res, next) => {
    try {
        res.json(await Post.find().sort({ createdAt: -1 }).populate('author', 'name role'));
    }
    catch (e) {
        next(e);
    }
});
router.post('/', auth, async (req, res, next) => {
    try {
        const title = String(req.body.title || '').trim(), body = String(req.body.body || '').trim();
        if (title.length < 3 || !body)
            return res.status(400).json({ error: 'Title and body are required' });
        const post = await Post.create({ title, body, author: req.user._id });
        res.status(201).json(await post.populate('author', 'name role'));
    }
    catch (e) {
        next(e);
    }
});
router.put('/:id', auth, async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid post id' });
        const post = await Post.findById(req.params.id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString())
            return res.status(403).json({ error: 'You can edit only your own posts' });
        post.title = String(req.body.title || '').trim();
        post.body = String(req.body.body || '').trim();
        if (post.title.length < 3 || !post.body)
            return res.status(400).json({ error: 'Title and body are required' });
        await post.save();
        res.json(await post.populate('author', 'name role'));
    }
    catch (e) {
        next(e);
    }
});
router.delete('/:id', auth, async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id))
            return res.status(400).json({ error: 'Invalid post id' });
        const post = await Post.findById(req.params.id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString())
            return res.status(403).json({ error: 'You can delete only your own posts' });
        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    }
    catch (e) {
        next(e);
    }
});
module.exports = router;
