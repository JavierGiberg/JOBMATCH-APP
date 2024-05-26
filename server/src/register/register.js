const Database = require("../../DataBase/DBConnection");
const bcrypt = require("bcrypt");
const dbConnection = Database.getInstance();

const register = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Error hashing password" });
    }

    dbConnection.query(
      "INSERT INTO t_users (email, password) VALUES (?, ?)",
      [email, hash],
      (err, result) => {
        if (err) {
          console.error("Error saving user to database:", err);
          return res
            .status(500)
            .json({ message: "User already exists or database error" });
        }
        res.status(201).json({ message: "User registered" });
      }
    );
  });
};

module.exports = { register };
