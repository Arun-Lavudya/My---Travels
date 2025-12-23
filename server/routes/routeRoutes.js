const express = require('express');
const router = express.Router();
const { getRoutes, addRoute, deleteRoute, updateRoute } = require('../controllers/routeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getRoutes);
router.post('/', authorize('admin'), addRoute);
router.put('/:id', authorize('admin'), updateRoute);
router.delete('/:id', authorize('admin'), deleteRoute);

module.exports = router;
