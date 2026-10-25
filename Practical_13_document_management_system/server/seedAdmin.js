require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
async function run() {
    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error('Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env');
    }
    if (ADMIN_PASSWORD.length < 12) {
        throw new Error('ADMIN_PASSWORD must be at least 12 characters long');
    }
    await mongoose.connect(MONGODB_URI);
    const email = ADMIN_EMAIL.trim().toLowerCase();
    const user = await User.findOneAndUpdate({ email }, {
        $set: {
            name: process.env.ADMIN_NAME || 'Document Administrator',
            passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
            role: 'admin',
        },
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`Administrator ready: ${user.email}`);
    await mongoose.disconnect();
}
run().catch((error) => {
    console.error('Admin bootstrap failed:', error.message);
    process.exit(1);
});
