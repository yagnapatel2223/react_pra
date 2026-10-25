const jwt = require('jsonwebtoken');
const User = require('../models/User');
async function auth(req, res, next) {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : '';
        if (!token)
            return res.status(401).json({ error: 'Authentication required' });
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub).select('_id name email role');
        if (!user)
            return res.status(401).json({ error: 'Account not found' });
        req.user = user;
        next();
    }
    catch (e) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
function adminOnly(req, res, next) {
    if (req.user?.role !== 'admin')
        return res.status(403).json({ error: 'Administrator role required' });
    next();
}
module.exports = { auth, adminOnly };
