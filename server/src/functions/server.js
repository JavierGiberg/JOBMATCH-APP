const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = process.env.PORT || 8000;
const registerStudents = require("../register/registerStudents");
const { mainProcess } = require("../process/mainProcess");
const { PullSemiProfile } = require("../process/PullSemiProfile");
const bodyParser = require("body-parser");
const { bcrypt } = require("bcrypt");

var studentId = "";

app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); // Enable JSON body parsing

//--------------------------------------------------------------------------------

app.get("/api/testApi", async (req, res) => {
  console.log("testApi call!!");
  res.send("result from server API is running");
});

//--------------------------------------------------------------------------------
app.get("/api/registerStudents", async (req, res) => {
  console.log("registerStudents  call");

  const academic = req.query.academic;
  const username = req.query.username;
  const password = req.query.password;
  const githubUsername = req.query.githubUsername;
  const email = req.query.email;

  console.log(
    "registerStudents",
    academic,
    username,
    "*********",
    githubUsername,
    email
  );
  try {
    const result = await registerStudents(
      academic,
      username,
      password,
      githubUsername,
      email
    );
    if (result === "success") {
      studentId = await mainProcess(username, password, githubUsername);
    }
    await res.send({ result, studentId });
  } catch (error) {
    console.log("error in RegisterStudents");
  }
});

//--------------------------------------------------------------------------------
app.get("/api/studentSemiProfile", async (req, res) => {
  console.log("studentSemiProfile call");
  try {
    const studentId = req.query.studentId;
    console.log("call to studentSemiProfile api id:" + studentId);
    const Data = await PullSemiProfile(studentId);
    res.send(Data);
  } catch (error) {
    console.log("error in studentSemiProfile", error);
  }
});

//--------------------------------------------------------------------------------
const { register } = require("../register/register");
app.post("/api/register", register);

//--------------------------------------------------------------------------------
const { login } = require("../register/login");
app.post("/api/login", login);

//--------------------------------------------------------------------------------
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_TOKEN_LOGIN;
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
app.get("/api/token-validation", authenticateToken, (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
});

//--------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
