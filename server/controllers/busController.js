const pool = require('../config/db');

// @desc    Get all buses
// @route   GET /api/v1/buses
// @access  Private (Admin/Operator)
const getBuses = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT b.*, bt.name as bus_type_name, bt.type as bus_type, bt.is_ac 
            FROM buses b 
            JOIN bus_types bt ON b.bus_type_id = bt.id
            ORDER BY b.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new bus
// @route   POST /api/v1/buses
// @access  Private (Admin/Operator)
const addBus = async (req, res) => {
    const { bus_type_id, reg_number, name, total_seats, layout_id, status } = req.body;

    if (!bus_type_id || !reg_number || !total_seats) {
        return res.status(400).json({ message: 'Please provide required fields' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO buses (operator_id, bus_type_id, reg_number, name, total_seats, layout_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, bus_type_id, reg_number, name, total_seats, layout_id, status || 'active']
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Bus added successfully'
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Registration number already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get bus types
// @route   GET /api/v1/buses/types
// @access  Private
const getBusTypes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM bus_types');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a bus
// @route   PUT /api/v1/buses/:id
// @access  Private (Admin)
const updateBus = async (req, res) => {
    const { bus_type_id, reg_number, name, total_seats, layout_id, status } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE buses SET bus_type_id = ?, reg_number = ?, name = ?, total_seats = ?, layout_id = ?, status = ? WHERE id = ?',
            [bus_type_id, reg_number, name, total_seats, layout_id, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        res.json({ message: 'Bus updated successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Registration number already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a bus
// @route   DELETE /api/v1/buses/:id
// @access  Private (Admin)
const deleteBus = async (req, res) => {
    console.log(`[BACKEND] Delete request for bus ${req.params.id} by user ${req.user.id}`);
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [bus] = await connection.query('SELECT * FROM buses WHERE id = ?', [req.params.id]);

        if (bus.length === 0) {
            console.log('[BACKEND] Bus not found');
            await connection.rollback();
            return res.status(404).json({ message: 'Bus not found' });
        }

        await connection.query(
            'INSERT INTO audit_master (table_name, data_id, deleted_data, deleted_by) VALUES (?, ?, ?, ?)',
            ['buses', req.params.id, JSON.stringify(bus[0]), req.user.id]
        );
        console.log('[BACKEND] Audit record created');

        await connection.query('DELETE FROM buses WHERE id = ?', [req.params.id]);

        await connection.commit();
        console.log('[BACKEND] Deletion successful');
        res.json({ message: 'Bus deleted successfully and archived to audit log' });
    } catch (error) {
        await connection.rollback();
        console.error('[BACKEND] DELETE ERROR:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Cannot delete bus: It has active schedules or bookings associated with it.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

module.exports = {
    getBuses,
    addBus,
    getBusTypes,
    updateBus,
    deleteBus
};
