const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const db = require('../db/dbConnect');
// const sendEmailGrid = require('./sendEmailGrid');

const sendEmailGrid = require('./mailSendGrid');

// const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;

const userCtrl = {
  register: async (req, res) => {
    try {
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
};

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '5m',
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const removeTmp = (pat) => {
  fs.unlink(pat, (err) => {
    if (err) throw err;
  });
};

module.exports = userCtrl;
