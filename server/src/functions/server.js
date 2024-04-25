const express = require("express");
const { mainProcess } = require("../process/mainProcess");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 80;
const path = require("path");
app.use(cors());

app.use(express.static("web/build"));

app.get("/api/process", async (req, res) => {
  //   res.send("Hello, Azure VM!");
  const username = req.query.username;
  const password = req.query.password;
  const pdfPath = req.query.pdfPath;
  const usernameGitHub = req.query.usernameGitHub;
  const endPoint = req.query.endPoint;

  const result = await mainProcess(
    username,
    password,
    pdfPath,
    usernameGitHub,
    endPoint
  );

  res.send(`result is: ${result}`);
});

app.get("/api/", async (req, res) => {
  res.send("Hello, JOBMAT API VM!");
});

app.get("/api/register", async (req, res) => {
  res.send(
    "This should be registration page, should get all details from req, return them as res with the id that was saved in the database."
  );
});

app.get("/api/login", async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  const gitgubUsername = req.query.gitgubUsername;
  res.send(
    // "This should be login page, should get all details (username + password) from req, return them as res with the id that was saved in the database."
    `/login: username: ${username}, password: ${password}, gitgubUsername: ${gitgubUsername}`
  );
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "web", "build", "index.html"));
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
