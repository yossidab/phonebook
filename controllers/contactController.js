const Contact = require('../models/contact');
const logger = require('../logger');
const { promisify } = require('util');

const DEFAULT_LIMIT = 10; // Default limit for pagination

// Create a new contact
exports.createContact = async (req, res) => {
  logger.debug('Creating a new contact', { body: req.body });
  try {
    const contact = new Contact(req.body);
    await contact.save();
    logger.info(`Contact created: ${contact._id}`);
    res.status(201).json(contact);
  } catch (err) {
    logger.error('Error creating contact', err);
    res.status(400).json({ error: err.message });
  }
};

// Get contacts with pagination, search, and sorting
exports.getContacts = async (req, res) => {
  const { page = 1, limit = DEFAULT_LIMIT, firstName, lastName, phone, address } = req.query;
  logger.debug('Getting contacts', { query: req.query });
  try {
    // Ensure limit does not exceed DEFAULT_LIMIT
    const validatedLimit = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, DEFAULT_LIMIT);

    const query = {};
    if (firstName) query.firstName = { $regex: `^${firstName}`, $options: 'i' };
    if (lastName) query.lastName = { $regex: `^${lastName}`, $options: 'i' };
    if (phone) query.phone = { $regex: `^${phone}`, $options: 'i' };
    if (address) query.address = { $regex: `^${address}`, $options: 'i' };

    const contacts = await Contact.find(query)
      .sort({ firstName: 1, lastName: 1 })
      .limit(validatedLimit)
      .skip((page - 1) * validatedLimit)
      .exec();
    const count = await Contact.countDocuments(query);

    logger.info(`Retrieved contacts, page: ${page}, limit: ${validatedLimit}`, { count });

    res.json({
      contacts,
      totalPages: Math.ceil(count / validatedLimit),
      currentPage: page
    });
  } catch (err) {
    logger.error('Error retrieving contacts', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all contacts from the database without filtering
exports.getAllContacts = async (req, res) => {
  const { page = 1, limit = DEFAULT_LIMIT } = req.query;
  logger.debug(`Getting all contacts from the database with page: ${page}, limit: ${limit}`);
  try {
    if (cachedContacts) {
      logger.info('Returning cached contacts');
      return res.json(JSON.parse(cachedContacts));
    }

    const validatedLimit = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, DEFAULT_LIMIT);
    const contacts = await Contact.find()
      .sort({ firstName: 1, lastName: 1 })
      .limit(validatedLimit)
      .skip((page - 1) * validatedLimit)
      .exec();
    const count = await Contact.countDocuments();
    logger.info('Contacts retrieved from the database');

    res.json({
      contacts,
      totalPages: Math.ceil(count / validatedLimit),
      currentPage: page
    });
  } catch (err) {
    logger.error('Error retrieving contacts', err);
    res.status(500).json({ error: err.message });
  }
};

// Get a single contact by ID
exports.getContactById = async (req, res) => {
  logger.debug(`Getting contact by ID: ${req.query.id}`);
  try {
    const contact = await Contact.findById(req.query.id);
    if (!contact) {
      logger.warn(`Contact not found: ${req.query.id}`);
      return res.status(404).json({ error: 'Contact not found' });
    }
    logger.info(`Retrieved contact: ${req.query.id}`);
    res.json(contact);
  } catch (err) {
    logger.error('Error retrieving contact by ID', err);
    res.status(500).json({ error: err.message });
  }
};

// Find a contact by phone
exports.getContactByPhone = async (req, res) => {
  const { phone } = req.query.phone;
  logger.debug(`Getting contact by phone: ${phone}`);
  try {
    const contact = await Contact.findOne({ phone });
    if (!contact) {
      logger.warn(`Contact not found with phone: ${phone}`);
      return res.status(404).json({ error: 'Contact not found' });
    }
    logger.info(`Retrieved contact with phone: ${phone}`);
    res.json(contact);
  } catch (err) {
    logger.error('Error retrieving contact by phone', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a contact by ID
exports.updateContact = async (req, res) => {
  logger.debug(`Updating contact by ID: ${req.query.id}`, { body: req.body });
  try {
    const contact = await Contact.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!contact) {
      logger.warn(`Contact not found for update: ${req.query.id}`);
      return res.status(404).json({ error: 'Contact not found' });
    }
    logger.info(`Updated contact: ${req.query.id}`);
    res.json(contact);
  } catch (err) {
    logger.error('Error updating contact', err);
    res.status(400).json({ error: err.message });
  }
};

// Delete a contact by ID
exports.deleteContact = async (req, res) => {
  logger.debug(`Deleting contact by ID: ${req.body.id}`);
  try {
    const contact = await Contact.findByIdAndDelete(req.body.id);
    if (!contact) {
      logger.warn(`Contact not found for deletion: ${req.body.id}`);
      return res.status(404).json({ error: 'Contact not found' });
    }
    logger.info(`Deleted contact: ${req.body.id}`);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    logger.error('Error deleting contact', err);
    res.status(500).json({ error: err.message });
  }
};
