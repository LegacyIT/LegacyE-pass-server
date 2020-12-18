const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');

const legacyGSSchema = new mongoose.Schema({
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
    default: 'Intern'
  },
  course: {
    type: String,
    enum: [
      'Graphics Design',
      'Logo Specialization',
      'Motion Graphics',
      'Web Development',
      'Digital Marketing'
    ],
    required: [true, 'Department Course is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

legacyGSSchema.pre('save', function(next) {
  this.passcode = crypto.randomBytes(6).toString('hex');
  next();
});

const LegacyGS = mongoose.model('LegacyGS', legacyGSSchema);

module.exports = LegacyGS;
