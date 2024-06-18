const { extraction_balance_pdf } = require("./extraction_balance_pdf");
const { scrapeGitHubData } = require("./scrapeGitHubData");
const { scrapePdfSapirCollege } = require("./scrapePdfSapirCollege");
const { averageCalculation } = require("./averageCalculation");
const getClassificationsFromSQL = require('./getClassificationsFromSQL');
const path = require("path");

async function mainProcess(usernameSapir, passwordSapir, usernameGitHub) {
  console.log("mainProcess START!");

  // module 1
  console.log("module 1 START!");
  let PdfFilefullPath;
  try {
    PdfFilefullPath = await scrapePdfSapirCollege(usernameSapir, passwordSapir);
    console.log(PdfFilefullPath);
  } catch (error) {
    console.log("Error in module 1:", error);
    return; // Exit the function if this module fails
  }

  // module 2
  console.log("module 2 START!");
  let nameOfFile, relativePathToPdf, studentInfo, courses;
  try {
    nameOfFile = path.basename(PdfFilefullPath);
    console.log(nameOfFile);
    relativePathToPdf = path.join(
      "server",
      "src",
      "downloads_balance",
      nameOfFile
    );
    console.log(relativePathToPdf);
    ({ studentInfo, courses } = await extraction_balance_pdf(relativePathToPdf));
  } catch (error) {
    console.log("Error in module 2:", error);
    return; // Exit the function if this module fails
  }

  // module 3
  console.log("module 3 START!");
  let useInfo, summary;
  try {
    const githubData = await scrapeGitHubData(studentInfo.id, usernameGitHub);
    if (githubData) {
      useInfo = githubData.userInfo;
      summary = githubData.summary;
    } else {
      console.log("GitHub data is null");
      return; // Exit the function if GitHub data is null
    }
  } catch (error) {
    console.log("Error in module 3:", error);
    return; // Exit the function if this module fails
  }


  // module 4
  console.log("module 4 START!");
  try {
    await averageCalculation(studentInfo.id); // Add await if this is an async function
    console.log("mainProcess DONE!");
    return studentInfo.id;
  } catch (error) {
    console.log("Error in module 4:", error);
  }
}

module.exports = { mainProcess };