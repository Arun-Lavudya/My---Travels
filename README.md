# ASAP Travels - Bus Booking Platform

A comprehensive bus booking platform built with modern web technologies, featuring customer booking interface, admin management panel, and robust backend services.

## 🚀 Features

### Customer Portal
- Search and book bus tickets
- Real-time seat availability
- Secure payment processing
- Booking history and management

### Admin Panel
- Dashboard with analytics
- Bus fleet management
- Route management
- Booking management
- Real-time statistics

### Backend Services
- RESTful API with Express.js
- MySQL database for data persistence
- Redis caching for performance
- JWT-based authentication
- Secure password hashing with bcrypt

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- React Router

**Backend:**
- Node.js
- Express.js
- MySQL 2
- Redis
- JWT Authentication

**Security:**
- Helmet.js
- CORS
- bcryptjs
- Input validation with Joi

## 📁 Project Structure

```
MyTravelsWebsite/
├── client/          # Customer-facing React application
├── admin/           # Admin panel React application
└── server/          # Node.js/Express backend API
    ├── config/      # Database and Redis configuration
    ├── controllers/ # Business logic
    ├── routes/      # API routes
    ├── middleware/  # Authentication middleware
    ├── db/          # Database schema
    └── scripts/     # Database initialization scripts
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- Redis

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MyTravelsWebsite
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create .env file with the following variables:
   # DB_HOST=localhost
   # DB_USER=root
   # DB_PASSWORD=your_password
   # DB_NAME=bus_booking
   # JWT_SECRET=your_jwt_secret
   # REDIS_HOST=localhost
   # REDIS_PORT=6379
   # PORT=5001
   
   # Initialize database
   node scripts/initDb.js
   
   # Seed sample data (optional)
   node scripts/seedData.js
   
   # Start server
   node index.js
   ```

3. **Client Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Admin Panel Setup**
   ```bash
   cd admin
   npm install
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Buses
- `GET /api/v1/buses` - Get all buses
- `POST /api/v1/buses` - Add new bus (Admin)
- `PUT /api/v1/buses/:id` - Update bus (Admin)
- `DELETE /api/v1/buses/:id` - Delete bus (Admin)

### Routes
- `GET /api/v1/routes` - Get all routes
- `POST /api/v1/routes` - Add new route (Admin)
- `PUT /api/v1/routes/:id` - Update route (Admin)
- `DELETE /api/v1/routes/:id` - Delete route (Admin)

### Bookings
- `GET /api/v1/bookings` - Get all bookings
- `POST /api/v1/bookings` - Create new booking
- `GET /api/v1/bookings/:id` - Get booking details
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Cancel booking

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics (Admin)

## 🔒 Environment Variables

Create a `.env` file in the `server` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bus_booking
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=5001
```

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Arun Lavudya

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
