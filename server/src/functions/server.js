const express = require("express");
const { mainProcess } = require("../process/mainProcess");

const app = express();
const port = process.env.PORT || 3000;

// Define your routes here
app.get("/", async (req, res) => {
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
