const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Database = require("../../DataBase/DBConnection");
const dbConnection = Database.getInstance();
require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});

const secret = process.env.JWT_TOKEN_LOGIN;

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  dbConnection.query(
    "SELECT * FROM t_users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch)
          return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, secret, {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
      });
    }
  );
};

module.exports = { login };
