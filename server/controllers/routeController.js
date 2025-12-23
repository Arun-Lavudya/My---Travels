const pool = require('../config/db');

// @desc    Get all routes
// @route   GET /api/v1/routes
// @access  Private
const getRoutes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM routes ORDER BY source_city ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new route
// @route   POST /api/v1/routes
// @access  Private
const addRoute = async (req, res) => {
    const { source_city, destination_city, distance_km, duration_minutes } = req.body;

    if (!source_city || !destination_city) {
        return res.status(400).json({ message: 'Source and Destination are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO routes (source_city, destination_city, distance_km, duration_minutes) VALUES (?, ?, ?, ?)',
            [source_city, destination_city, distance_km, duration_minutes]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Route added successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a route
// @route   DELETE /api/v1/routes/:id
// @access  Private (Admin)
const deleteRoute = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Fetch data before deletion for auditing
        const [route] = await connection.query('SELECT * FROM routes WHERE id = ?', [req.params.id]);

        if (route.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Route not found' });
        }

        // 2. Insert into audit_master
        await connection.query(
            'INSERT INTO audit_master (table_name, data_id, deleted_data, deleted_by) VALUES (?, ?, ?, ?)',
            ['routes', req.params.id, JSON.stringify(route[0]), req.user.id]
        );

        // 3. Perform actual deletion
        const [result] = await connection.query('DELETE FROM routes WHERE id = ?', [req.params.id]);

        await connection.commit();
        res.json({ message: 'Route deleted successfully and archived to audit log' });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Cannot delete route: It has active schedules associated with it.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

// @desc    Update a route
// @route   PUT /api/v1/routes/:id
// @access  Private (Admin)
const updateRoute = async (req, res) => {
    const { source_city, destination_city, distance_km, duration_minutes } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE routes SET source_city = ?, destination_city = ?, distance_km = ?, duration_minutes = ? WHERE id = ?',
            [source_city, destination_city, distance_km, duration_minutes, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Route not found' });
        }

        res.json({ message: 'Route updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getRoutes,
    addRoute,
    deleteRoute,
    updateRoute
};
