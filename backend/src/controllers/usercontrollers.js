import User from '../models/user.js';
import bcrypt from 'bcryptjs';  

// @desc    Create new user (Super Admin only)
// @route   POST /api/users
// @access  Private/SuperAdmin
export const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, permissions } = req.body;

    // Prevent creating another super admin through this endpoint
    if (role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot create Super Admin through this endpoint'
      });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'customer',
      permissions: permissions || []
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          role: user.role,
          permissions: user.permissions,
          isActive: user.isActive,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-refreshTokens -passwordResetToken -passwordResetExpires')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-refreshTokens -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, role, permissions, isActive } = req.body;

    // Prevent changing super admin
    const targetUser = await User.findById(req.params.id);
    if (targetUser.role === 'superadmin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify other Super Admin'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        role,
        permissions,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-refreshTokens -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting super admin
    if (user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete Super Admin'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reset user password (Super Admin only)
// @route   POST /api/users/:id/reset-password
// @access  Private/SuperAdmin
export const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const user = await User.findById(req.params.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent resetting super admin password (unless self)
    if (user.role === 'superadmin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot reset other Super Admin password'
      });
    }

    user.password = newPassword;
    // Clear all refresh tokens to force re-login
    user.refreshTokens = [];
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. User must login again.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};