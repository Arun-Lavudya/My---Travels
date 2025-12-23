const express = require('express');
const router = express.Router();
const { getBuses, addBus, getBusTypes, updateBus, deleteBus } = require('../controllers/busController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getBuses);
router.post('/', authorize('admin'), addBus);
router.put('/:id', authorize('admin'), updateBus);
router.delete('/:id', authorize('admin'), deleteBus);
router.get('/types', getBusTypes);

module.exports = router;
