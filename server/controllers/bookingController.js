const pool = require('../config/db');

// @desc    Create a manual booking (Admin/Operator)
// @route   POST /api/v1/bookings/manual
// @access  Private
const createManualBooking = async (req, res) => {
    const { schedule_id, customer_name, customer_email, customer_phone, seats } = req.body;

    if (!schedule_id || !customer_name || !customer_phone || !seats || !seats.length) {
        return res.status(400).json({ message: 'Missing required booking details' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Calculate total amount (base price from schedule)
        const [schedules] = await connection.query('SELECT base_price FROM schedules WHERE id = ?', [schedule_id]);
        if (schedules.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Schedule not found' });
        }
        const totalAmount = schedules[0].base_price * seats.length;

        // 2. Create Booking record
        const [bookingRes] = await connection.query(
            'INSERT INTO bookings (schedule_id, total_amount, status, booking_source, customer_name, customer_email, customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [schedule_id, totalAmount, 'confirmed', 'admin', customer_name, customer_email, customer_phone]
        );
        const bookingId = bookingRes.insertId;

        // 3. Update Inventory and Create Booking Seats
        for (const seatNumber of seats) {
            // Check availability and update
            const [updateRes] = await connection.query(
                'UPDATE inventory SET status = "booked", booking_id = ? WHERE schedule_id = ? AND seat_number = ? AND status = "available"',
                [bookingId, schedule_id, seatNumber]
            );

            if (updateRes.affectedRows === 0) {
                throw new Error(`Seat ${seatNumber} is no longer available`);
            }

            // Get inventory id for the link
            const [inv] = await connection.query('SELECT id FROM inventory WHERE schedule_id = ? AND seat_number = ?', [schedule_id, seatNumber]);
            const inventoryId = inv[0].id;

            // Link seat to booking
            await connection.query(
                'INSERT INTO booking_seats (booking_id, inventory_id, passenger_name, seat_number, price) VALUES (?, ?, ?, ?, ?)',
                [bookingId, inventoryId, customer_name, seatNumber, schedules[0].base_price]
            );
        }

        await connection.commit();
        res.status(201).json({
            id: bookingId,
            message: 'Manual booking created successfully',
            amount: totalAmount
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(400).json({ message: error.message || 'Server error' });
    } finally {
        connection.release();
    }
};

// @desc    Get inventory/seats for a schedule
// @route   GET /api/v1/bookings/inventory/:scheduleId
// @access  Private
const getInventory = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT seat_number, status, price FROM inventory WHERE schedule_id = ?',
            [req.params.scheduleId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private (Admin/Operator)
const getBookings = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT b.*, s.departure_time, r.source_city, r.destination_city, bu.reg_number as bus_reg
            FROM bookings b
            JOIN schedules s ON b.schedule_id = s.id
            JOIN routes r ON s.route_id = r.id
            JOIN buses bu ON s.bus_id = bu.id
            ORDER BY b.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all schedules
// @route   GET /api/v1/bookings/schedules
// @access  Private
const getSchedules = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.*, r.source_city, r.destination_city, bu.reg_number
            FROM schedules s
            JOIN routes r ON s.route_id = r.id
            JOIN buses bu ON s.bus_id = bu.id
            WHERE s.departure_time >= NOW()
            ORDER BY s.departure_time ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createManualBooking,
    getInventory,
    getBookings,
    getSchedules
};
