const express = require("express");
const cors = require("cors");
const app = express();
const https = require("https");
const fs = require("fs");
const path = require("path");
// const port = process.env.PORT || 8000;

const Register = require("../register/Register");
const { mainProcess } = require("../process/mainProcess");
const { PullSemiProfile } = require("../process/PullSemiProfile");

var studentId = "";

app.use(cors());
app.use(express.json()); // Enable JSON body parsing

app.use("/", (req, res, next) => {
  res.send("Hello from SSL server");
});

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "../../certificate/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../../certificate/cert.pem")),
  },
  app
);

sslServer.listen(3443, () => {
  console.log("Secure Server is running on port 3443");
});

// app.get("/api/register", async (req, res) => {
//   const academic = req.query.academic;
//   const username = req.query.username;
//   const password = req.query.password;
//   const githubUsername = req.query.githubUsername;
//   const email = req.query.email;

//   console.log("register", academic, username, password, githubUsername, email);
//   try {
//     const result = await Register(
//       academic,
//       username,
//       password,
//       githubUsername,
//       email
//     );
//     if (result === "success") {
//       studentId = await mainProcess(username, password, githubUsername);
//     }
//     await res.send({ result, studentId });
//   } catch (error) {
//     console.log("error in register");
//   }
// });

// app.get("/api/studentSemiProfile", async (req, res) => {
//   try {
//     const studentId = req.query.studentId;
//     console.log("call to studentSemiProfile api id:" + studentId);
//     const Data = await PullSemiProfile(studentId);
//     res.send(Data);
//   } catch (error) {
//     console.log("error in studentSemiProfile", error);
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
