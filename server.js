require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db'); // Ensure this path is correct
const morgan = require('morgan');
const logger = require('./logger');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use('/api/contacts', contactRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

module.exports = app;
