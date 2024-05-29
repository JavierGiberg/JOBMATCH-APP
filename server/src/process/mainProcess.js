const { extraction_balance_pdf } = require("./extraction_balance_pdf");
const { scrapeGitHubData } = require("./scrapeGitHubData");
const { scrapePdfSapirCollege } = require("./scrapePdfSapirCollege");
const { averageCalculation } = require("./averageCalculation");
const path = require("path");

async function mainProcess(usernameSapir, passwordSapir, usernameGitHub) {
  console.log("mainProcess START!");
  // module 1
  console.log("module 1 START!");
  try {
    const PdfFilefullPath = await scrapePdfSapirCollege(
      usernameSapir,
      passwordSapir
    );
  } catch (error) {
    console.log(error);
  }

  // module 2
  console.log("module 2 START!");
  try {
    const nameOfFile = path.basename(PdfFilefullPath);
    console.log(nameOfFile);
    const relativePathToPdf = path.join(
      "server",
      "src",
      "downloads_balance",
      nameOfFile
    );
    console.log(relativePathToPdf);
    const { studentInfo, courses } = await extraction_balance_pdf(
      relativePathToPdf
    );
  } catch (error) {
    console.log(error);
  }

  // module 3
  console.log("module 3 START!");
  try {
    const { useInfo, summary } = await scrapeGitHubData(
      studentInfo.id,
      usernameGitHub
    );
  } catch (error) {
    console.log(error);
  }

  // module 4
  console.log("module 4 START!");
  try {
    averageCalculation(studentInfo.id);
    console.log("mainProcess DONE!");
    return studentInfo.id;
  } catch (error) {
    console.log(error);
  }
}
module.exports = { mainProcess };
