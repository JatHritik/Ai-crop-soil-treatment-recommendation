const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const prisma = require('../config/db.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.js');
const { analyzeWithAI } = require('../services/aiService.js');
const { processFile } = require('../services/fileservice.js');

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/reports';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `report-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5*1024*1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and documents are allowed'));
    }
  }
});

// Upload soil report
router.post('/upload', authenticateToken, upload.single('reportFile'), [
  body('district').notEmpty().trim(),
  body('state').notEmpty().trim(),
  body('area').notEmpty().trim(),
  body('season').isIn(['KHARIF', 'RABI', 'ZAID'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Report file is required' });
    }

    const { district, state, area, season } = req.body;

    // Process file to extract text
    let extractedText = '';
    try {
      extractedText = await processFile(req.file.path);
    } catch (error) {
      console.error('File processing error:', error);
      extractedText = 'File processing failed';
    }

    // Create soil report
    const report = await prisma.soilReport.create({
      data: {
        userId: req.user.id,
        district,
        state,
        area,
        season,
        reportFile: req.file.path,
        extractedText,
        status: 'PENDING'
      },
      include: {
        user: {
          select: { username: true, email: true }
        }
      }
    });

    // Start AI analysis in background
    setImmediate(async () => {
      try {
        await prisma.soilReport.update({
          where: { id: report.id },
          data: { status: 'ANALYZING' }
        });

        const analysis = await analyzeWithAI({
          district,
          state,
          area,
          season,
          extractedText
        });

        await prisma.soilReport.update({
          where: { id: report.id },
          data: {
            aiAnalysis: analysis,
            status: 'COMPLETED',
            analyzedAt: new Date()
          }
        });

        console.log(`✅ AI Analysis completed for report ${report.id}`);
      } catch (error) {
        console.error('AI Analysis failed:', error);
        await prisma.soilReport.update({
          where: { id: report.id },
          data: { 
            status: 'FAILED',
            aiAnalysis: {
              error: error.message,
              timestamp: new Date().toISOString()
            }
          }
        });
      }
    });

    res.status(201).json({
      message: 'Report uploaded successfully. AI analysis is in progress and will be completed shortly.',
      report: {
        id: report.id,
        district: report.district,
        state: report.state,
        area: report.area,
        season: report.season,
        status: report.status,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload report' });
  }
});

// Get user's reports
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const [reports, total] = await Promise.all([
      prisma.soilReport.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          district: true,
          state: true,
          area: true,
          season: true,
          status: true,
          createdAt: true,
          analyzedAt: true,
          aiAnalysis: true
        }
      }),
      prisma.soilReport.count({ where })
    ]);

    res.json({
      reports,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

// Get specific report details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await prisma.soilReport.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        user: {
          select: { username: true, email: true }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to get report' });
  }
});

// Check report status
router.get('/:id/status', authenticateToken, async (req, res) => {
  try {
    const report = await prisma.soilReport.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      select: {
        id: true,
        status: true,
        analyzedAt: true,
        createdAt: true
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ 
      status: report.status,
      analyzedAt: report.analyzedAt,
      createdAt: report.createdAt
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// Admin: Get all reports
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [reports, total] = await Promise.all([
      prisma.soilReport.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, username: true, email: true }
          }
        }
      }),
      prisma.soilReport.count({ where })
    ]);

    res.json({
      reports,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (error) {
    console.error('Admin get reports error:', error);
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

module.exports = router;