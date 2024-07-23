const mongoose = require('mongoose');
const logger = require('../logger');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  logger.info('Connected to MongoDB');
}).catch((err) => {
  logger.error('Failed to connect to MongoDB', err);
  process.exit(1); // Exit the application with a failure code
});

module.exports = mongoose.connection;
