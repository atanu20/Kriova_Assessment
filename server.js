require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const auth = require('./middleware/auth');

const sendEmailGrid = require('./controllers/mailSendGrid');
const db = require('./db/dbConnect');

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
app.use('/api/user', require('./routes/userRouter'));

app.use('/api/upload', require('./routes/upload'));

app.get('/', async (req, res) => {
  const q = `SELECT * FROM raw_visitoraddressxref`;
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
  // res.send('welcome to Kriova');cd c
});

app.get('/auth/isVerify', auth, async (req, res) => {
  try {
    const user = req.user;
    // console.log(user.id);

    // const mydata = await employeeTable.findById(user.id).select('-password');
    // if (mydata) {
    //   res.send({ success: true, msg: 'done', userInfo: mydata });
    // } else {
    //   res.send({ success: false, msg: 'something wrong', userInfo: [] });
    // }
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

// Connect to mongodb

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
//
