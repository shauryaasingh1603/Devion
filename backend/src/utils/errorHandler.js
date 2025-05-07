/**
 * Error handling utility for the MCP Server
 */

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

/**
 * Custom error class for API-related errors
 */
class ApiError extends Error {
  constructor(message, statusCode, source) {
    super(message);
    this.statusCode = statusCode || 500;
    this.source = source;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Custom error class for data processing errors
 */
class DataProcessingError extends Error {
  constructor(message, data) {
    super(message);
    this.data = data;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware for Express
 */
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      type: err.name || 'Error'
    }
  };

  if (err.source) {
    errorResponse.error.source = err.source;
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode
  });

  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler to catch errors in async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Log API errors but continue execution
 */
const logApiError = (error, source) => {
  logger.error({
    message: `API Error from ${source}: ${error.message}`,
    stack: error.stack,
    source
  });
};

module.exports = {
  ApiError,
  DataProcessingError,
  errorMiddleware,
  asyncHandler,
  logApiError,
  logger
};
