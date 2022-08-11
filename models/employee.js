const mongoose = require('mongoose');

const employeeScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  profileimg: {
    type: String,
    trim: true,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    trim: true,
    default: '',
  },
  dob: {
    type: String,
    trim: true,
    default: '',
  },
  street: {
    type: String,
    trim: true,
    default: '',
  },
  city: {
    type: String,
    trim: true,
    default: '',
  },
  state: {
    type: String,
    trim: true,
    default: '',
  },
  country: {
    type: String,
    trim: true,
    default: '',
  },
  pincode: {
    type: String,
    trim: true,
    default: '',
  },

  joindate: {
    type: Date,
    default: Date.now,
  },
});

const employeeTable = new mongoose.model('employee', employeeScheme);
module.exports = employeeTable;
