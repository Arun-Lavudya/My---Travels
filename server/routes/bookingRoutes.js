const express = require('express');
const router = express.Router();
const { createManualBooking, getInventory, getBookings, getSchedules } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getBookings);
router.get('/schedules', getSchedules);
router.post('/manual', createManualBooking);
router.get('/inventory/:scheduleId', getInventory);

module.exports = router;
