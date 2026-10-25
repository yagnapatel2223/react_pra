require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
async function run() {
    if (!process.env.MONGODB_URI || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)
        throw new Error('Set MongoDB and admin environment values first');
    if (process.env.ADMIN_PASSWORD.length < 12)
        throw new Error('Use an administrator password of at least 12 characters');
    await mongoose.connect(process.env.MONGODB_URI);
    const email = process.env.ADMIN_EMAIL.toLowerCase();
    const user = await User.findOneAndUpdate({ email }, { $set: { name: process.env.ADMIN_NAME || 'Site Administrator', passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: 'admin' } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`Administrator ready: ${user.email}`);
    await mongoose.disconnect();
}
run().catch(e => { console.error(e.message); process.exit(1); });
