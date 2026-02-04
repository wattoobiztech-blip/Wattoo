const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config/env');
const Helpers = require('./utils/helpers');

// Create Express app
const app = express();

// Trust proxy (for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: [
    config.frontendUrl,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json(
        Helpers.formatError('Invalid JSON format', 400)
      );
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// File upload middleware
app.use(fileUpload({
  limits: { 
    fileSize: config.upload.maxFileSize // 5MB
  },
  abortOnLimit: true,
  responseOnLimit: 'File size limit exceeded',
  uploadTimeout: 60000, // 1 minute
  useTempFiles: true,
  tempFileDir: '/tmp/',
  debug: config.NODE_ENV === 'development'
}));

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs, // 15 minutes
  max: config.security.rateLimitMaxRequests, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/health';
  }
});

app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Rishta Matrimonial Platform API',
    version: '1.0.0',
    documentation: {
      authentication: '/api/auth',
      users: '/api/user',
      profiles: '/api/profile',
      search: '/api/search',
      subscriptions: '/api/subscriptions',
      admin: '/api/admin'
    },
    endpoints: {
      health: '/health',
      docs: '/'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
const apiPrefix = config.api.prefix;

// Import route modules
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const profileRoutes = require('./routes/profile.routes');
const searchRoutes = require('./routes/search.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const adminRoutes = require('./routes/admin.routes');

// Use routes
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/user`, userRoutes);
app.use(`${apiPrefix}/profile`, profileRoutes);
app.use(`${apiPrefix}/search`, searchRoutes);
app.use(`${apiPrefix}/subscriptions`, subscriptionRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

// Serve static files (uploaded images, etc.)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 handler for API routes
app.use(`${apiPrefix}/*`, (req, res) => {
  res.status(404).json(
    Helpers.formatError(`API endpoint not found: ${req.method} ${req.originalUrl}`, 404)
  );
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  // Handle specific error types
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json(
      Helpers.formatError('Invalid JSON format', 400)
    );
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json(
      Helpers.formatError('File size too large', 413)
    );
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json(
      Helpers.formatError('Unexpected file field', 400)
    );
  }

  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json(
      Helpers.formatError('Duplicate entry', 409)
    );
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json(
      Helpers.formatError('Referenced record not found', 400)
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      Helpers.formatError('Invalid token', 401)
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      Helpers.formatError('Token expired', 401)
    );
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(
      Helpers.formatError('Validation failed', 400, err.details)
    );
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = config.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Something went wrong';

  res.status(statusCode).json(
    Helpers.formatError(message, statusCode)
  );
});

// Handle 404 for non-API routes
app.use('*', (req, res) => {
  res.status(404).json(
    Helpers.formatError(`Route not found: ${req.method} ${req.originalUrl}`, 404)
  );
});

module.exports = app;