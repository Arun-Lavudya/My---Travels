const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seed = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD, // Empty for local
            database: process.env.DB_NAME,
        });

        console.log('🌱 Connected to database...');

        // 1. Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);

        // Check if admin exists
        const [existing] = await pool.query('SELECT * FROM operators WHERE email = ?', ['admin@redbus.com']);
        let operatorId;

        if (existing.length === 0) {
            const [op] = await pool.query(
                'INSERT INTO operators (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                ['Super Admin', 'admin@redbus.com', hash, 'admin']
            );
            operatorId = op.insertId;
            console.log('✅ Created Admin User: admin@redbus.com / password123');
        } else {
            operatorId = existing[0].id;
            console.log('ℹ️ Admin User already exists');
        }

        // 2. Create Bus Type
        const [bt] = await pool.query('INSERT IGNORE INTO bus_types (name, type, is_ac) VALUES (?, ?, ?)', ['Volvo Multi-Axle', 'Sleeper', true]);
        const [busType] = await pool.query('SELECT id FROM bus_types LIMIT 1');
        const busTypeId = busType[0].id;

        // 3. Create Seat Layout (Simple 2x1 Sleeper)
        const layoutJson = JSON.stringify({
            lower: [
                { id: 'L1', type: 'sleeper', row: 1, col: 1 }, { id: 'L2', type: 'sleeper', row: 1, col: 2 },
                { id: 'L3', type: 'sleeper', row: 2, col: 1 }, { id: 'L4', type: 'sleeper', row: 2, col: 2 }
            ],
            upper: [
                { id: 'U1', type: 'sleeper', row: 1, col: 1 }, { id: 'U2', type: 'sleeper', row: 1, col: 2 }
            ]
        });
        const [lo] = await pool.query('INSERT INTO seat_layouts (name, layout_json) VALUES (?, ?)', ['Volvo Sleeper Standard', layoutJson]);
        const layoutId = lo.insertId;

        // 4. Create Bus
        const [bu] = await pool.query(
            'INSERT IGNORE INTO buses (operator_id, bus_type_id, reg_number, name, total_seats, layout_id) VALUES (?, ?, ?, ?, ?, ?)',
            [operatorId, busTypeId, 'TS09UB1234', 'Morning Star Travels', 30, layoutId]
        );
        const [busRes] = await pool.query('SELECT id FROM buses WHERE reg_number = ?', ['TS09UB1234']);
        const busId = busRes[0].id;

        // 5. Create Route
        const [ro] = await pool.query('INSERT INTO routes (source_city, destination_city, distance_km, duration_minutes) VALUES (?, ?, ?, ?)', ['Hyderabad', 'Bengaluru', 570, 480]);
        const routeId = ro.insertId;

        // 6. Create Schedule
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(21, 0, 0, 0); // 9 PM

        const arrival = new Date(tomorrow);
        arrival.setHours(tomorrow.getHours() + 8); // 8 hours later

        const [sc] = await pool.query(
            'INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, base_price, status) VALUES (?, ?, ?, ?, ?, ?)',
            [busId, routeId, tomorrow, arrival, 1200.00, 'scheduled']
        );
        const scheduleId = sc.insertId;

        // 7. Initialize Inventory for Schedule
        // In a real app, this would be auto-generated based on layout. For now, manual insert of a few seats.
        const seats = ['L1', 'L2', 'L3', 'L4', 'U1', 'U2'];
        for (const seat of seats) {
            await pool.query(
                'INSERT INTO inventory (schedule_id, seat_number, status, price) VALUES (?, ?, ?, ?)',
                [scheduleId, seat, 'available', 1200.00]
            );
        }
        console.log(`✅ initialized ${seats.length} seats for schedule #${scheduleId}`);

        console.log('✅ Seed Data Created Successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
