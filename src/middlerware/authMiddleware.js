const jwt = require('jsonwebtoken');
const AuthService = require('../services/authService');

const authService = new AuthService();

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const isBlacklisted = await authService.isBlacklisted(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;