const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const certPath = path.join(__dirname, "/DigiCertGlobalRootCA.crt.pem");

require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});
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
    ca: fs.readFileSync(certPath),
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
