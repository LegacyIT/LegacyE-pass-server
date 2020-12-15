const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');

const legacyAMSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required.'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.']
  },
  photo: {
    type: String,
    required: [true, 'A profile image is required.']
  },
  phoneNumber: {
    type: String,
    required: [true, 'PhoneNumber is required'],
    unique: true
  },
  department: {
    type: String,
    required: [true, 'Department is required.']
  },
  passcode: {
    type: String
  },
  position: {
    type: String,
    enum: ['Affiliate'],
    required: [true, 'Department Position is required.']
  },
  designation: {
    type: String,
    enum: ['Content Creator', 'Digital Marketer'],
    required: [true, 'Department Designation is required.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

legacyAMSchema.pre('save', function(next) {
  this.passcode = crypto.randomBytes(6).toString('hex');
  next();
});


const LegacyAM = mongoose.model('LegacyAM', legacyAMSchema);

module.exports = LegacyAM;
