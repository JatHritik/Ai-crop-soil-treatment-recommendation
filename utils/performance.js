const os = require('os');
const fs = require('fs').promises;
const path = require('path');

// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      totalResponseTime: 0,
      errors: 0,
      startTime: Date.now(),
    };
    this.requestTimes = [];
    this.errorLog = [];
  }

  // Record request metrics
  recordRequest(responseTime, isError = false) {
    this.metrics.requests++;
    this.metrics.totalResponseTime += responseTime;
    this.requestTimes.push(responseTime);
    
    if (isError) {
      this.metrics.errors++;
    }

    // Keep only last 1000 request times for memory efficiency
    if (this.requestTimes.length > 1000) {
      this.requestTimes = this.requestTimes.slice(-1000);
    }
  }

  // Record error
  recordError(error, context = {}) {
    this.metrics.errors++;
    this.errorLog.push({
      timestamp: new Date().toISOString(),
      error: error.message || error,
      stack: error.stack,
      context,
    });

    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }
  }

  // Get system metrics
  getSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      uptime: process.uptime(),
      platform: os.platform(),
      arch: os.arch(),
      loadAverage: os.loadavg(),
      freeMemory: Math.round(os.freemem() / 1024 / 1024), // MB
      totalMemory: Math.round(os.totalmem() / 1024 / 1024), // MB
    };
  }

  // Get application metrics
  getApplicationMetrics() {
    const avgResponseTime = this.metrics.requests > 0 
      ? this.metrics.totalResponseTime / this.metrics.requests 
      : 0;

    const sortedTimes = [...this.requestTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p99Index = Math.floor(sortedTimes.length * 0.99);

    return {
      requests: this.metrics.requests,
      errors: this.metrics.errors,
      errorRate: this.metrics.requests > 0 
        ? (this.metrics.errors / this.metrics.requests) * 100 
        : 0,
      averageResponseTime: Math.round(avgResponseTime),
      p95ResponseTime: sortedTimes[p95Index] || 0,
      p99ResponseTime: sortedTimes[p99Index] || 0,
      uptime: Date.now() - this.metrics.startTime,
      recentErrors: this.errorLog.slice(-10),
    };
  }

  // Get comprehensive metrics
  getMetrics() {
    return {
      timestamp: new Date().toISOString(),
      system: this.getSystemMetrics(),
      application: this.getApplicationMetrics(),
    };
  }

  // Reset metrics
  reset() {
    this.metrics = {
      requests: 0,
      totalResponseTime: 0,
      errors: 0,
      startTime: Date.now(),
    };
    this.requestTimes = [];
    this.errorLog = [];
  }

  // Save metrics to file
  async saveMetrics(filename = 'performance-metrics.json') {
    try {
      const metrics = this.getMetrics();
      const filePath = path.join(process.cwd(), 'logs', filename);
      
      // Ensure logs directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      await fs.writeFile(filePath, JSON.stringify(metrics, null, 2));
      console.log(`📊 Performance metrics saved to ${filePath}`);
    } catch (error) {
      console.error('Failed to save performance metrics:', error);
    }
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// Middleware for Express
const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const isError = res.statusCode >= 400;
    
    performanceMonitor.recordRequest(responseTime, isError);
    
    // Log slow requests
    if (responseTime > 5000) { // 5 seconds
      console.warn(`🐌 Slow request: ${req.method} ${req.url} - ${responseTime}ms`);
    }
  });
  
  next();
};

// Error tracking middleware
const errorTrackingMiddleware = (err, req, res, next) => {
  performanceMonitor.recordError(err, {
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });
  
  next(err);
};

// Performance monitoring endpoint
const getPerformanceEndpoint = (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get performance metrics' });
  }
};

// Health check with performance data
const getHealthCheck = (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    const isHealthy = metrics.application.errorRate < 10; // Less than 10% error rate
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: metrics.application.uptime,
      errorRate: metrics.application.errorRate,
      memory: metrics.system.memory.heapUsed,
      requests: metrics.application.requests,
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Health check failed' 
    });
  }
};

// Auto-save metrics every 5 minutes
setInterval(() => {
  performanceMonitor.saveMetrics();
}, 5 * 60 * 1000);

module.exports = {
  PerformanceMonitor,
  performanceMonitor,
  performanceMiddleware,
  errorTrackingMiddleware,
  getPerformanceEndpoint,
  getHealthCheck,
};

