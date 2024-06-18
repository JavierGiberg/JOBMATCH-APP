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
const { mainAlgo } = require("../matchAlgorithm/mainAlgo");
const crypto = require("crypto");
const { getLinkedInAccessToken, getLinkedInUserProfile } = require("./../process/linkedinJobs");
const { pushClassificationsToSQL } = require("../process/pushClassificationsToSQL");
const { getClassificationsFromSQL } = require("../process/getClassificationsFromSQL");
const Database = require('../../DataBase/DBConnection');

var studentId = "";

app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); // Enable JSON body parsing

//--------------------------------------------------------------------------------

app.get("/api/testApi", async (req, res) => {
  console.log("testApi call!!");
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
      await res.send({ result, studentId });
    }
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
//http://localhost:8000/api/mainAlgo?degree=B.Sc&major=%D7%90

app.get("/api/mainAlgo", authenticateToken, async (req, res) => {
  //add after done debug -> authenticateToken
  try {
    const preferences = {
      gpa: {
        programming: Number(req.query.programming),
        algorithm: Number(req.query.algorithm),
        cyber: Number(req.query.cyber),
        math: Number(req.query.math),
      },
      languages: req.query.languages ? req.query.languages.split(",") : [],
      order: req.query.order ? req.query.order.split(",") : [],
    };
    const degree = "B.Sc";
    const major = req.query.major.trim().substring(0, 1);
    if (!degree || !major || !preferences) {
      return res.status(400).send("Missing degree or major parameter");
    }

    const data = await mainAlgo(degree, major, preferences);
    res.json(data);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).send("Internal Server Error");
  }
});
//--------------------------------------------------------------------------------
const { averageCalculation } = require("../process/averageCalculation");
app.get("/api/averageCalculation", async (req, res) => {
  try {
    console.log("averageCalculation call");
    const studentId = req.query.studentId;
    averageCalculation(studentId);
  } catch (error) {
    console.error("Error handling request:", error);
  }
});
//--------------------------------------------------------------------------------

const { understandQuestion } = require("../chat/understandQuestion");
const { answer } = require("../chat/answer");
app.post("/api/messages", async (req, res) => {
  const ids = req.query.ids.split(",");
  const { message } = req.body;
  const questionType = understandQuestion(message);

  try {
    const returnMessage = await answer(questionType, ids, message);
    res.send({ user: "Bot", message: returnMessage });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while processing the request" });
  }
});

//--------------------------------------------------------------------------------
const {
  mainSimilarStudents,
} = require("../similarStudents/mainSimilarStudents");
app.get("/api/mainSimilarStudents", async (req, res) => {
  const matrix = await mainSimilarStudents();
  res.send(matrix);
});

// Push Classifications API
app.post("/api/pushClassifications", async (req, res) => {
  const { username } = req.body;
  try {
    await pushClassificationsToSQL(username);
    res.status(200).send('Classifications pushed successfully');
  } catch (error) {
    console.error('Error pushing classifications:', error);
    res.status(500).send('Error pushing classifications');
  }
});

// Get Classifications API
app.get("/api/getClassifications", async (req, res) => {
  const { username } = req.query;
  try {
    const classifications = await getClassificationsFromSQL(username);
    res.status(200).json(classifications);
  } catch (error) {
    console.error('Error fetching classifications:', error);
    res.status(500).send('Error fetching classifications');
  }
});
app.post("/api/pushAndGetClassifications", async (req, res) => {
  const { username } = req.body;
  const connection = Database.getInstance();
  try {
    // Push classifications to SQL
    await pushClassificationsToSQL(connection, username);

    // Get classifications from SQL
    const classifications = await getClassificationsFromSQL(connection, username);

    res.status(200).json(classifications);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Error processing request');
  }
});

function generateState(length) {
  return crypto.randomBytes(length).toString('hex');
}

app.get("/auth/linkedin", (req, res) => {
  const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
  const linkedinRedirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const state = generateState(16); // Generate a unique state string
  const scope = 'r_liteprofile r_emailaddress r_fullprofile';

  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(linkedinRedirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
  res.redirect(authorizationUrl);
});

app.get("/auth/linkedin/callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  try {
    const accessToken = await getLinkedInAccessToken(code);
    const { profile, positions } = await getLinkedInUserProfile(accessToken);
    res.json({ profile, positions });
  } catch (error) {
    res.status(500).send('Error during LinkedIn OAuth flow');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});