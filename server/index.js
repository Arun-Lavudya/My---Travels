const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
require('./config/db');
require('./config/redis');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/buses', require('./routes/busRoutes'));
app.use('/api/v1/routes', require('./routes/routeRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
