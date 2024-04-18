const { extraction_balance_pdf } = require("./extraction_balance_pdf");
const { scrapeGitHubData } = require("./scrapeGitHubData");
const { scrapePdfSapirColleg } = require("./scrapePdfSapirColleg");
const path = require("path");

async function mainProcess(
  usernameSapir,
  passwordSapir,
  pdfPath,
  usernameGitHub,
  endPoint
) {
  if (endPoint === "1") {
    const PdfFilePath = await scrapePdfSapirColleg(
      usernameSapir,
      passwordSapir
    );
  }
  if (endPoint === "2") {
    const { studentInfo, courses } = await extraction_balance_pdf(pdfPath);
  }
  if (endPoint === "3") {
    // Generate random id for testing
    let id = "";
    for (let i = 0; i < 10; i++) {
      const digit = Math.floor(Math.random() * 10);
      id += digit.toString();
    }
    const { useInfo, summary } = await scrapeGitHubData(id, usernameGitHub);
  }
  return "endPoint : " + endPoint;
}
module.exports = { mainProcess };
