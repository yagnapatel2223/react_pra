const mongoose = require('mongoose');
const schema = new mongoose.Schema({ title: { type: String, required: true, trim: true, maxlength: 160 }, body: { type: String, required: true, trim: true, maxlength: 20000 }, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } }, { timestamps: true });
module.exports = mongoose.model('Post', schema);
