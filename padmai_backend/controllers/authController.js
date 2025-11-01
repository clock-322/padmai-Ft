const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('🔐 Register API called with:', { name, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate role
    const allowedRoles = ['parent', 'teacher', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Allowed roles are parent, teacher, admin'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role
    });
    console.log('✅ User created successfully:', user._id);

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ Registration successful for:', email);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login API called for:', email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ Login successful for:', email);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    console.log('👤 Get current user called for:', req.user._id);
    const user = await User.findById(req.user._id);
    // Remove password from response
    if (user && user.password) {
      delete user.password;
    }
    console.log('✅ Current user fetched:', user?.email);
    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('❌ Get current user error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Edit Profile
exports.editProfile = async (req, res) => {
  try {
    const { email, name } = req.body;
    console.log('✏️ Edit profile API called for:', email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update only the name field
    const updatedUser = await User.updateByEmail(email, { name });
    
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }

    // Remove password from response
    if (updatedUser.password) {
      delete updatedUser.password;
    }

    console.log('✅ Profile updated successfully for:', email);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        }
      }
    });
  } catch (error) {
    console.error('❌ Edit profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

