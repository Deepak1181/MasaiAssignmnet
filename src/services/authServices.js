const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const dotenv = require('dotenv');

dotenv.config();

class AuthService {
    async register(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        return user;
    }

    async login(username, password) {
        const user = await User.findOne({ username });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

        await Token.create({ token: refreshToken, type: 'refresh', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

        return { token, refreshToken };
    }

    async blacklistToken(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await Token.create({ token, type: 'blacklist', expiresAt: new Date(decoded.exp * 1000) });
    }

    async refreshToken(refreshToken) {
        const tokenDoc = await Token.findOne({ token: refreshToken, type: 'refresh' });
        if (!tokenDoc) return null;

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        return newToken;
    }

    async isBlacklisted(token) {
        const tokenDoc = await Token.findOne({ token, type: 'blacklist' });
        return !!tokenDoc;
    }
}

module.exports = AuthService;