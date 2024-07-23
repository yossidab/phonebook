require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const logger = require('./logger');
const mongoose = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use('/api/contacts', contactRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
  process.exit(1); // Exit the application with a failure code
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown', err);
  // Application specific logging, throwing an error, or other logic here
  process.exit(1); // Exit the application with a failure code
});

module.exports = app;

