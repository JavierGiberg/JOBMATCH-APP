const { extraction_balance_pdf } = require("./extraction_balance_pdf");
const { scrapeGitHubData } = require("./scrapeGitHubData");
const { scrapePdfSapirCollege } = require("./scrapePdfSapirCollege");
const path = require("path");

async function mainProcess(
  usernameSapir,
  passwordSapir,
  pdfPath,
  usernameGitHub,
  endPoint
) {
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

  // Generate random id for testing
  // let id = "";
  // for (const i = 0; i < 10; i++) {
  //   const digit = Math.floor(Math.random() * 10);
  //   id += digit.toString();
  // }
  // const { useInfo, summary } = await scrapeGitHubData(id, usernameGitHub);

  return "done handling " + nameOfFile;
}
module.exports = { mainProcess };
