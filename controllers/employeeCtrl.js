const employeeTable = require('../models/employee');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// const sendEmailGrid = require('./sendEmailGrid');

const sendEmailGrid = require('./mailSendGrid');

// const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;

const employeeCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await employeeTable.findOne({ email });
      if (user)
        return res.json({ success: false, msg: 'This email already exists.' });

      if (password.length < 6)
        return res.json({
          success: false,
          msg: 'Password must be at least 6 characters.',
        });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = {
        name,
        email,
        password: passwordHash,
      };
      // console.log(name.split(' ')[0]);
      const activation_token = createActivationToken(newUser);

      const url = `${CLIENT_URL}/user/activate/${activation_token}`;
      sendEmailGrid(
        name.split(' ')[0],
        email,
        url,
        'Verify your email address',
        'actvation'
      );

      res.json({
        success: true,
        msg: 'Register Success! Please activate your email to start.',
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { name, email, password } = user;
      const userexist = await employeeTable.findOne({ email });
      if (userexist)
        return res.json({ success: false, msg: 'This email already exists.' });

      const newUser = new employeeTable({
        name,
        email,
        password,
      });

      await newUser.save();

      res.json({
        success: true,
        msg: 'Account has been activated!',
        newUser,
      });
    } catch (err) {
      return res.json({ success: false, msg: 'Invalid Authentication.' });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await employeeTable.findOne({ email });
      if (!user)
        return res.json({ success: false, msg: 'This email does not exist.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.json({ success: false, msg: 'Password is incorrect.' });

      const access_token = createAccessToken({ id: user._id });

      res.json({
        success: true,
        access_token,
        isEmployer: user.isEmployer,
      });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: 'Please login now!' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: 'Please login now!' });

        const access_token = createAccessToken({ id: user.id });
        res.json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await employeeTable.findOne({ email });
      if (!user)
        return res.json({ success: false, msg: 'This email does not exist.' });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/user/reset-password/${access_token}`;

      sendEmailGrid(
        user.name.split(' ')[0],
        email,
        url,
        'Reset your password',
        'forget'
      );
      res.json({ success: true, msg: 'Please check your email.' });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      if (password.length < 6)
        return res.json({
          success: false,
          msg: 'Password must be at least 6 characters.',
        });
      const passwordHash = await bcrypt.hash(password, 12);

      await employeeTable.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ success: true, msg: 'Password successfully changed!' });
    } catch (err) {
      return res.json({ success: false, msg: err.message });
    }
  },
  getUserInfor: async (req, res) => {
    try {
      const user = await employeeTable
        .findById(req.user.id)
        .select('-password');

      res.json({ success: true, user: user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateAllDetails: async (req, res) => {
    try {
      const newdata = await employeeTable.findOneAndUpdate(
        { _id: req.user.id },

        req.body,
        { new: true }
      );

      res.json({ success: true, msg: 'Update Success!', newdata });
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

module.exports = employeeCtrl;

// const result = await jobTable.find({

//   $or: [{
//       employer_company_category: { '$in': ['Agri-tech', 'Artificial Intelligence'] }
//   }, {
//       $or: [{
//           tech_skills: { '$in': ['React', 'Node JS'] },
//       }, {
//           non_tech_skills: { '$in': ['Php', 'Next JS'] },
//       }]
//   }],

//   $or: [{
//       job_type: { '$in': ['Office', 'Remote'] }
//   }, {
//       job_location: { '$in': ['Bangalore', 'Kolkata'] }
//   }],

//   $or: [{
//       experience: { '$in': ['Entry Level/ Fresher'] }
//   }, {
//       no_employees: { '$in': ['101-500 Employees', '21-100 Employees'] }
//   }],

//   $and: [{
//       salary: { $gte: 7 }
//   }, {
//       salary: { $lte: 27 }
//   }]

// })
