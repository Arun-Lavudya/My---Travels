const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwtHelper');

// @desc    Register a new operator/admin
// @route   POST /api/v1/auth/register
// @access  Public (for now, or Admin only)
const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        // Check if user exists
        const [existing] = await pool.query('SELECT * FROM operators WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await pool.query(
            'INSERT INTO operators (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'operator']
        );

        const token = signToken({ id: result.insertId, email, role: role || 'operator' });

        res.status(201).json({
            id: result.insertId,
            name,
            email,
            role: role || 'operator',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM operators WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken({ id: user.id, email: user.email, role: user.role });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role FROM operators WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, getMe };
