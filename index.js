// index.js — slimmed

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/userRoute.js');
const adminRoutes = require('./routes/adminRoute.js');
const reportRoutes = require('./routes/reportRoute.js');

const app = express();
const PORT = process.env.PORT || 3000;

// If behind a proxy (Netlify/Vercel/Nginx), keep this:
app.set('trust proxy', 1);

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin : ["https://ai-crop-soil-treatment-recommendati.vercel.app/", "http://127.0.0.1:5173", "http://192.168.1.218:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static (keep if you actually serve uploads)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/reports', reportRoutes);

// Health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const requestId = req.headers['x-request-id'] || 'unknown';

  console.error(`[${requestId}]`, err);

  res.status(err.status || 500).json({
    error: 'Internal server error',
    requestId,
    ...(isDev && { message: err.message, stack: err.stack }),
  });
});

// Start
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`🛑 ${signal} received. Shutting down...`);
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('❌ Forced shutdown');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
