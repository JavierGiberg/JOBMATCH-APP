const express = require("express");
const cors = require("cors");
const app = express();
const https = require("https");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 8000;

const registerStudents = require("../register/registerStudents");
const { mainProcess } = require("../process/mainProcess");
const { PullSemiProfile } = require("../process/PullSemiProfile");

var studentId = "";

app.use(cors());
app.use(express.json()); // Enable JSON body parsing

// app.use("/", (req, res, next) => {
//   res.send("Hello from SSL server");
// });

// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "../../certificate/key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "../../certificate/cert.pem")),
//   },
//   app
// );

// sslServer.listen(8000, () => {
//   console.log("Secure Server is running on port 8000");
// });

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
    password,
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
  const username = req.quuery.username;
  const password = req.quuery.password;
  const email = req.quuery.email;
  console.log("Register-App call");
  res.send(`username: ${username} , password: ${password} , email: ${email}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
