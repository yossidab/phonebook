const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/create-contact', contactController.createContact);
router.get('/get-contact', contactController.getContacts);
router.get('/get-all-contact', contactController.getAllContact);
router.get('/get-contact-by-id/:id', contactController.getContactById);
router.get('/get-contact-by-phone/:phone', contactController.getContactByPhone);
router.put('/update-contact', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
