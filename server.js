const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const db = require('./db/dbConnect');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  // const q = `SELECT * FROM raw_visitoraddressxref`;
  const q = `SELECT * FROM visitor`;

  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
//
