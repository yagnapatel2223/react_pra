const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const safe = u => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const makeToken = u => jwt.sign({ sub: u._id.toString() }, process.env.JWT_SECRET, { expiresIn: '8h' });
router.post('/register', async (req, res, next) => {
    try {
        const name = String(req.body.name || '').trim(), email = String(req.body.email || '').trim().toLowerCase(), password = String(req.body.password || '');
        if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8)
            return res.status(400).json({ error: 'Enter name, valid email and a password of at least 8 characters' });
        if (await User.exists({ email }))
            return res.status(409).json({ error: 'Email already registered' });
        const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: 'user' });
        res.status(201).json({ token: makeToken(user), user: safe(user) });
    }
    catch (e) {
        next(e);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase(), password = String(req.body.password || '');
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.passwordHash)))
            return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ token: makeToken(user), user: safe(user) });
    }
    catch (e) {
        next(e);
    }
});
module.exports = router;
