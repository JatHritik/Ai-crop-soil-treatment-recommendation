const express = require('express');
const { authenticateToken } = require('../middleware/auth.js');
const prisma = require('../config/db.js');

const router = express.Router();

// Get user dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalReports, completedReports, pendingReports, analyzingReports, recentReports] = await Promise.all([
      prisma.soilReport.count({ where: { userId } }),
      prisma.soilReport.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.soilReport.count({ where: { userId, status: 'PENDING' } }),
      prisma.soilReport.count({ where: { userId, status: 'ANALYZING' } }),
      prisma.soilReport.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          district: true,
          state: true,
          season: true,
          status: true,
          createdAt: true,
          analyzedAt: true
        }
      })
    ]);

    res.json({
      stats: {
        totalReports,
        completedReports,
        pendingReports,
        analyzingReports,
        failedReports: totalReports - completedReports - pendingReports - analyzingReports
      },
      recentReports
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { profile } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { profile },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profile: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;