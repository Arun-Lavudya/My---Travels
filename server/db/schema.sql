-- Database Schema for Myravelwebsite (Bus Booking System)

CREATE DATABASE IF NOT EXISTS bus_booking;
USE bus_booking;

-- Operators (Admins/Bus Owners)
CREATE TABLE operators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'operator') DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bus Types
CREATE TABLE bus_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g., "Volvo Multi-Axle", "Scania AC"
    type VARCHAR(50) NOT NULL, -- e.g., "Sleeper", "Seater", "Semi-Sleeper"
    is_ac BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buses
CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operator_id INT NOT NULL,
    bus_type_id INT NOT NULL,
    reg_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100), -- Display name e.g. "Morning Star"
    total_seats INT NOT NULL,
    status ENUM('active', 'maintenance', 'retired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (operator_id) REFERENCES operators(id),
    FOREIGN KEY (bus_type_id) REFERENCES bus_types(id)
);

-- Routes
CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    distance_km INT,
    duration_minutes INT, -- Estimated duration
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Route Stops (Boarding/Dropping Points)
CREATE TABLE route_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    type ENUM('boarding', 'dropping') NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    landmark VARCHAR(100),
    time_offset_minutes INT NOT NULL, -- Minutes from departure time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- Seat Layouts (Template for buses)
CREATE TABLE seat_layouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    layout_json JSON NOT NULL, -- Store visual coordinates and types (lower/upper/seater)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link Bus to Layout
ALTER TABLE buses ADD COLUMN layout_id INT;
ALTER TABLE buses ADD FOREIGN KEY (layout_id) REFERENCES seat_layouts(id);

-- Schedules (Trips)
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    route_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    status ENUM('scheduled', 'delayed', 'cancelled', 'completed') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- Inventory (The SSOT for availability)
-- One row per seat per schedule
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    is_ladies_seat BOOLEAN DEFAULT FALSE,
    status ENUM('available', 'blocked', 'booked') DEFAULT 'available',
    blocked_by_id INT, -- If blocked by admin
    booking_id INT, -- Linked when booked
    version INT DEFAULT 1, -- Optimistic locking
    price DECIMAL(10, 2), -- Dynamic pricing override
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_seat_schedule (schedule_id, seat_number),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);

-- Bookings
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Nullable for guest checkouts
    schedule_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'failed') DEFAULT 'pending',
    booking_source ENUM('website', 'app', 'admin', 'api') DEFAULT 'website',
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20) NOT NULL,
    payment_id VARCHAR(100), -- Razorpay Order ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);

-- Booking Seats (Many-to-Many link)
-- Links a booking to specific inventory items
CREATE TABLE booking_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    inventory_id INT NOT NULL,
    passenger_name VARCHAR(100),
    passenger_age INT,
    passenger_gender ENUM('male', 'female', 'other'),
    seat_number VARCHAR(10),
    price DECIMAL(10, 2),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

-- Inventory Audit Log (Events)
CREATE TABLE inventory_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT NOT NULL,
    event_type ENUM('block', 'release', 'book', 'cancel') NOT NULL,
    triggered_by VARCHAR(50), -- "system", "user:123", "admin:1"
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
