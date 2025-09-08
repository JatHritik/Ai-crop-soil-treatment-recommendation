const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/db.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.js');
const { analyzeWithAI, getDetailedRecommendations } = require('../services/aiService.js');
const { processFile } = require('../services/fileservice.js');

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/reports';
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
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
    console.log('Upload request received:', {
      body: req.body,
      file: req.file ? { name: req.file.originalname, size: req.file.size } : null,
      user: req.user ? { id: req.user.id } : null
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      console.log('No file uploaded');
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

    console.log('Report data being sent:', {
      id: report.id,
      status: report.status,
      hasAiAnalysis: !!report.aiAnalysis,
      aiAnalysisType: typeof report.aiAnalysis,
      aiAnalysisKeys: report.aiAnalysis ? Object.keys(report.aiAnalysis) : null
    });

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

// Delete report
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Delete request received for report ID:', req.params.id);
    console.log('User ID:', req.user.id);
    
    const report = await prisma.soilReport.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    console.log('Report found:', !!report);

    if (!report) {
      console.log('Report not found or not owned by user');
      return res.status(404).json({ error: 'Report not found' });
    }

    // Delete the report file from filesystem
    if (report.reportFile && fs.existsSync(report.reportFile)) {
      try {
        fs.unlinkSync(report.reportFile);
        console.log(`Deleted file: ${report.reportFile}`);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the report from database
    await prisma.soilReport.delete({
      where: { id: req.params.id }
    });

    console.log(`✅ Report ${req.params.id} deleted successfully`);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Failed to delete report' });
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

// Get detailed recommendations for a report
router.get('/:id/detailed-recommendations', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the report
    const report = await prisma.soilReport.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Check if user owns the report or is admin
    if (report.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!report.aiAnalysis) {
      return res.status(400).json({ error: 'AI analysis not available for this report' });
    }

    // Get detailed recommendations
    const location = {
      district: report.district,
      state: report.state,
      area: report.area
    };

    const detailedRecommendations = await getDetailedRecommendations(
      report.aiAnalysis,
      location,
      report.season
    );

    console.log(`✅ Detailed recommendations generated for report ${id}`);
    res.json({
      success: true,
      recommendations: detailedRecommendations,
      reportInfo: {
        id: report.id,
        district: report.district,
        state: report.state,
        area: report.area,
        season: report.season
      }
    });

  } catch (error) {
    console.error('Detailed recommendations error:', error);
    res.status(500).json({ error: 'Failed to get detailed recommendations' });
  }
});

module.exports = router;