const jwt = require('jsonwebtoken');
const User = require('../models/User');
async function auth(req, res, next) {
    try {
        const h = req.headers.authorization || '';
        if (!h.startsWith('Bearer '))
            return res.status(401).json({ error: 'Sign in required' });
        const payload = jwt.verify(h.slice(7), process.env.JWT_SECRET);
        const user = await User.findById(payload.sub).select('_id name email role');
        if (!user)
            return res.status(401).json({ error: 'User not found' });
        req.user = user;
        next();
    }
    catch (e) {
        res.status(401).json({ error: 'Invalid or expired session' });
    }
}
module.exports = { auth };
