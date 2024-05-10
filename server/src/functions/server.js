const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = process.env.PORT || 8000;
const https = require("https");
const fs = require("fs");
const registerStudents = require("../register/registerStudents");
const { mainProcess } = require("../process/mainProcess");
const { PullSemiProfile } = require("../process/PullSemiProfile");

var studentId = "";

app.use(cors());
app.use(express.json()); // Enable JSON body parsing

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "../../certificate", "key.pem")),
    cert: fs.readFileSync(
      path.join(__dirname, "../../certificate", "cert.pem")
    ),
  },
  app
);

app.get("/testApi", async (req, res) => {
  res.send("API is running");
});

// const API_SERVICE_URL =
//   "http://jobmatch.israelcentral.cloudapp.azure.com/secret";

// app.use(
//   "/api",
//   createProxyMiddleware({
//     // target: API_SERVICE_URL,
//     target: "http://localhost:8000/",
//     changeOrigin: true,
//   })
// );

app.get("/api/registerStudents", async (req, res) => {
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

app.get("/api/studentSemiProfile", async (req, res) => {
  try {
    const studentId = req.query.studentId;
    console.log("call to studentSemiProfile api id:" + studentId);
    const Data = await PullSemiProfile(studentId);
    res.send(Data);
  } catch (error) {
    console.log("error in studentSemiProfile", error);
  }
});
app.get("/api/app-register", async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  const email = req.query.email;
  console.log("Register-App call");
  res.send(`username: ${username} , password: ${password} , email: ${email}`);
});

sslServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
