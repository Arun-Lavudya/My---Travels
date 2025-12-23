const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/stats', getStats);

module.exports = router;
