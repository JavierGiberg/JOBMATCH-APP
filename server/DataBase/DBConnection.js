const mysql = require("mysql");
const fs = require("fs");

require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});
console.log(process.env.LOCAL_DB_HOST);
let instance = null;
//Local DB
// const connection = mysql.createConnection({
//   connectionLimit: 10,
//   host: process.env.LOCAL_DB_HOST,
//   user: process.env.LOCAL_DB_USER,
//   password: process.env.LOCAL_DB_PASS,
//   database: process.env.LOCAL_DB_NAME,
// });
//Azure DB
const connection = mysql.createConnection({
  connectionLimit: 10,
  host: process.env.PRODUCT_DB_HOST,
  user: process.env.PRODUCT_DB_USER,
  password: process.env.PRODUCT_DB_PASS,
  database: process.env.PRODUCT_DB_NAME,
  port: 3306,
  ssl: {
    ca: fs.readFileSync(
      "C:\\web\\JOBMATCH APP\\server\\DataBase\\DigiCertGlobalRootCA.crt.pem"
    ),
  },
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("The Singleton has connected to the database.");
});

class Database {
  static getInstance() {
    if (!instance) {
      instance = connection;
    }
    return instance;
  }
}

module.exports = Database;
