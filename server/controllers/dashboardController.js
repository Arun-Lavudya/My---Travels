const pool = require('../config/db');

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private (Admin/Operator)
const getStats = async (req, res) => {
    try {
        const [buses] = await pool.query('SELECT COUNT(*) as count FROM buses');
        const [routes] = await pool.query('SELECT COUNT(*) as count FROM routes');
        const [bookings] = await pool.query('SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = CURDATE()');
        const [totalBookings] = await pool.query('SELECT COUNT(*) as count FROM bookings');

        res.json({
            activeBuses: buses[0].count,
            totalRoutes: routes[0].count,
            todaysBookings: bookings[0].count,
            totalBookings: totalBookings[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getStats
};
