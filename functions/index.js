/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
// const { PullSemiProfile } = require("../server/src/process/PullSemiProfile");
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// exports.studentRegister = onRequest(async (request, response) => {
//   logger.info("Hello logs!", { structuredData: true });

//   const { academic, username, password, githubUsername, email } = request.body;
//   //   const username = request.username;
//   //   const password = request.password;
//   //   const githubUsername = request.githubUsername;
//   //   const email = request.email;

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

//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");

exports.studentRegister = functions.https.onRequest((request, response) => {
  console.log("Received request body:", request.body);

  const { academic, username, password, githubUsername, email } = request.body;
  console.log("register", academic, username, password, githubUsername, email);

  if (!academic || !username || !password || !githubUsername || !email) {
    console.error("Error in register: Missing required fields");
    return response.status(400).send("Missing information");
  }

  // Continue with processing these inputs...
  response.send(`Registration successful for ${username}`);
});
