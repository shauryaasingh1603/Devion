const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorMiddleware, logger } = require('./utils/errorHandler');
const insightsRoutes = require('./routes/insights.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'MCP Server is running',
    version: '1.0.0'
  });
});

app.use('/api/insights', insightsRoutes);

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({ 
    error: {
      message: 'Resource not found',
      path: req.path
    }
  });
});

const server = app.listen(PORT, () => {
  logger.info(`MCP Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
