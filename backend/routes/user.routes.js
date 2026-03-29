const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Placeholder controller functions - to be implemented
const userController = {
  getAllUsers: async (req, res) => {
    const { User } = require('../models');
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [{ model: require('../models').Company, as: 'company' }],
      });
      res.json({ success: true, data: { users } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  getUserById: async (req, res) => {
    const { User } = require('../models');
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
      });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: { user } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  updateUserRole: async (req, res) => {
    const { User } = require('../models');
    try {
      const { role } = req.body;
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      user.role = role;
      await user.save();
      res.json({ success: true, message: 'User role updated', data: { user } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

// Routes - all protected, some require admin role
router.use(protect); // All routes require authentication

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id/role', authorize('admin'), userController.updateUserRole);

module.exports = router;
