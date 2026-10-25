const mongoose = require('mongoose');
const schema = new mongoose.Schema({ originalName: { type: String, required: true }, storedName: { type: String, required: true, unique: true }, mimeType: { type: String, required: true }, size: { type: Number, required: true }, uploadedAt: { type: Date, default: Date.now } }, { timestamps: true });
module.exports = mongoose.model('FileRecord', schema);
