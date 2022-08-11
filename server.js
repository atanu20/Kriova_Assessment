require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const auth = require('./middleware/auth');

const employeeTable = require('./models/employee');
const sendEmailGrid = require('./controllers/mailSendGrid');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes
app.use('/user', require('./routes/employeeRouter'));

app.use('/api', require('./routes/upload'));

app.get('/', (req, res) => {
  res.send('welcome to Kriova');
});

app.get('/auth/isVerify', auth, async (req, res) => {
  try {
    const user = req.user;
    // console.log(user.id);

    const mydata = await employeeTable.findById(user.id).select('-password');
    if (mydata) {
      res.send({ success: true, msg: 'done', userInfo: mydata });
    } else {
      res.send({ success: false, msg: 'something wrong', userInfo: [] });
    }
  } catch (err) {
    res.send({ success: false, msg: 'Something wrong' });
  }
});

app.post('/emailsend', (req, res) => {
  try {
    const { sendername, receiveremail, conversationId, type } = req.body;
    let url;
    if (type === 'company') {
      url = `${process.env.CLIENT_URL + '/user/message/' + conversationId}`;
    } else {
      url = `${
        process.env.CLIENT_URL + '/employers/message/' + conversationId
      }`;
    }
    const text = `View Message`;
    // console.log(sendername);
    sendEmailGrid(sendername, receiveremail, url, text, 'message');

    res.json({
      success: true,
      msg: 'Email sended',
    });
  } catch (err) {
    res.send({ success: false, msg: err.message });
  }
});

// app.get('/emailsendss/:email', async (req, res) => {
//   try {
//     const same = 'atanu';
//     const receiveremail = req.params.email;
//     const url = 'abc';
//     const text = 'hii';
//     sendEmailGrid(same, receiveremail, url, text, 'message');

//     res.json({
//       success: true,
//       msg: 'Register Success! Please activate your email to start.',
//     });
//   } catch (err) {
//     res.send({ success: false, msg: err.message });
//   }
// });

// app.post('/resume', function (req, res, next) {
//   upload(req, res, function (err) {
//     if (err) {
//       // An error occurred when uploading
//       console.log('Err: ', err);
//       return;
//     } else {
//       console.log('req.file: ', JSON.stringify(req.file));
//       console.log('req.files: ', JSON.stringify(req.files));
//       return;
//     }
//   });
// });

// Connect to mongodb
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to mongodb');
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
//
