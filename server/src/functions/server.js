const express = require("express");
const { mainProcess } = require("../process/mainProcess");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
app.use(cors());

app.get("/process", async (req, res) => {
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

app.get("/", async (req, res) => {
  res.send("Hello, Azure VM!");
});

app.post("/register", async (req, res) => {
  res.send(
    "This should be registration page, should get all details from req, return them as res with the id that was saved in the database."
  );
});

app.get("/login", async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  const gitgubUsername = req.query.gitgubUsername;
  res.send(
    // "This should be login page, should get all details (username + password) from req, return them as res with the id that was saved in the database."
    `/login: username: ${username}, password: ${password}, gitgubUsername: ${gitgubUsername}`
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
