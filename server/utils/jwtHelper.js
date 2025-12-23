const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = '1d';

const signToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { signToken, verifyToken };
