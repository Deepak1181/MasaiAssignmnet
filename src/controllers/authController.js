const AuthService = require('../services/authService');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async register(req, res) {
        const { username, password } = req.body;
        const user = await this.authService.register(username, password);
        return res.status(201).json({ message: 'User registered successfully', user });
    }

    async login(req, res) {
        const { username, password } = req.body;
        const tokens = await this.authService.login(username, password);
        if (!tokens) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        return res.status(200).json(tokens);
    }

    async logout(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            await this.authService.blacklistToken(token);
        }
        return res.status(204).send();
    }

    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        const newToken = await this.authService.refreshToken(refreshToken);
        if (!newToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(200).json({ token: newToken });
    }
}

module.exports = AuthController;