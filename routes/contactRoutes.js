const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/create-contact', contactController.createContact);
router.get('/get-contacts', contactController.getContacts);
router.get('/get-all-contact', contactController.getAllContacts);
router.get('/get-contact-by-id', contactController.getContactById);
router.get('/get-contact-by-phone', contactController.getContactByPhone);
router.put('/update-contact', contactController.updateContact);
router.delete('/delete-contact', contactController.deleteContact);

module.exports = router;
