const mysql = require('mysql');

// const dbConnect = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'kriova',
// });

const dbConnect = mysql.createConnection({
  host: 'database-1.cinnhgaru4xp.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'atanujana',
  database: 'kriova',
});

module.exports = dbConnect;
