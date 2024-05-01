const { extraction_balance_pdf } = require("./extraction_balance_pdf");
const { scrapeGitHubData } = require("./scrapeGitHubData");
const { scrapePdfSapirCollege } = require("./scrapePdfSapirCollege");
const path = require("path");

async function mainProcess(usernameSapir, passwordSapir, usernameGitHub) {
  console.log("mainProcess START!");
  // module 1
  console.log("module 1 START!");
  const PdfFilefullPath = await scrapePdfSapirCollege(
    usernameSapir,
    passwordSapir
  );

  // module 2
  console.log("module 2 START!");
  const nameOfFile = "server\\src\\downloads_balance\\" + "Jango117grades.pdf"; // path.basename(PdfFilefullPath);
  const { studentInfo, courses } = await extraction_balance_pdf(nameOfFile);

  // module 3
  console.log("module 3 START!");
  const { useInfo, summary } = await scrapeGitHubData(
    studentInfo.id,
    usernameGitHub
  );

  return studentInfo.id;
}
module.exports = { mainProcess };
