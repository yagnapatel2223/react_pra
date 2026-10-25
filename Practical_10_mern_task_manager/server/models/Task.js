const mongoose = require('mongoose');
const schema = new mongoose.Schema({ title: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 }, done: { type: Boolean, default: false } }, { timestamps: true });
module.exports = mongoose.model('Task', schema);
