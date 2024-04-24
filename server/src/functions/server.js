const express = require("express");
const { mainProcess } = require("../process/mainProcess");

const app = express();
const port = process.env.PORT || 3000;

// Define your routes here
app.get("/", async (req, res) => {
  res.send("Hello, Azure VM!");
});

app.post("/register", async (req, res) => {
  res.send(
    "This should be registration page, should get all details from req, return them as res with the id that was saved in the database."
  );
});

app.get("/login", async (req, res) => {
  res.send(
    "This should be login page, should get all details (username + password) from req, return them as res with the id that was saved in the database."
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
