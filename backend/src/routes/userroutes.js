import express from 'express';
const router = express.Router();
import * as userController from '../controllers/usercontrollers.js';
import { protect, restrictTo, superAdminOnly } from '../middlewares/auth.js';

// All routes require authentication
router.use(protect);

// Routes accessible by admin and above
router.get('/', restrictTo('superadmin', 'admin'), userController.getUsers);
router.get('/:id', restrictTo('superadmin', 'admin'), userController.getUser);

// Super Admin only routes
router.post('/', superAdminOnly, userController.createUser);
router.put('/:id', superAdminOnly, userController.updateUser);
router.delete('/:id', superAdminOnly, userController.deleteUser);
router.post('/:id/reset-password', superAdminOnly, userController.resetUserPassword);

export default router;