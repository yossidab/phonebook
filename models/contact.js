const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true // Ensure phone numbers are unique
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  }
});

// Create indexes for the specified fields
contactSchema.index({ firstName: 1 });
contactSchema.index({ lastName: 1 });
contactSchema.index({ phone: 1 }, { unique: true });
contactSchema.index({ address: 1 });

module.exports = mongoose.model('Contact', contactSchema);
