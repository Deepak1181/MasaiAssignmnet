require('dotenv').config();

const config = {
    githubClientId: process.env.CLIENT_ID,
    githubClientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
};

module.exports = config;