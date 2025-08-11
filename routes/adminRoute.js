const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth.js');
const prisma = require('../config/db.js');

const router = express.Router();

// Admin dashboard stats
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers, 
      totalReports, 
      completedReports, 
      pendingReports, 
      analyzingReports,
      failedReports,
      recentUsers,
      recentReports
    ] = await Promise.all([
      prisma.user.count(),
      prisma.soilReport.count(),
      prisma.soilReport.count({ where: { status: 'COMPLETED' } }),
      prisma.soilReport.count({ where: { status: 'PENDING' } }),
      prisma.soilReport.count({ where: { status: 'ANALYZING' } }),
      prisma.soilReport.count({ where: { status: 'FAILED' } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.soilReport.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { username: true, email: true }
          }
        }
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalReports,
        completedReports,
        pendingReports,
        analyzingReports,
        failedReports
      },
      recentUsers,
      recentReports
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to get admin dashboard data' });
  }
});

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          profile: true,
          createdAt: true,
          _count: {
            reports: true
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Update user role
router.put('/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['ADMIN', 'USER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    });

    res.json({
      message: 'User role updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;