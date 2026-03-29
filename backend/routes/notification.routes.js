const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Notification routes
router.get('/', notificationController.getNotifications);
router.get('/subscribe', notificationController.subscribeToUpdates);

module.exports = router;
