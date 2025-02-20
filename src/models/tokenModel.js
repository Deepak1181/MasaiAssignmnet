const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    type: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;