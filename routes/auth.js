const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/db.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// Register
console.log('Register route handler defined');
router.post('/register', async (req, res) => {
  try {
    console.log('=== REGISTRATION REQUEST START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('=== REGISTRATION REQUEST END ===');
    
    // Manual validation
    const { username, email: rawEmail, password, role = 'USER', profile } = req.body;
    
    if (!username || username.length < 3) {
      console.log('Validation error: Username too short');
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    
    if (!rawEmail || !rawEmail.includes('@')) {
      console.log('Validation error: Invalid email');
      return res.status(400).json({ error: 'Invalid email address' });
    }
    
    if (!password || password.length < 6) {
      console.log('Validation error: Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Normalize email manually
    const email = rawEmail.toLowerCase().trim();

    // Check if trying to register as ADMIN
    if (role === 'ADMIN') {
      // Count existing administrators
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });
      
      console.log('Current admin count:', adminCount);
      
      if (adminCount >= 2) {
        console.log('Admin limit reached. Cannot register more administrators.');
        return res.status(400).json({ 
          error: 'Administrator limit reached. Only 2 administrators are allowed. Please register as USER or FARMER instead.' 
        });
      }
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    console.log('Checking for existing user:', { email, username, existingUser });

    if (existingUser) {
      console.log('User already exists:', existingUser);
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        profile: profile || {}
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profile: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

module.exports = router;