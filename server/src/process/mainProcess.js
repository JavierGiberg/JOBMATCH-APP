const { extraction_balance_pdf } = require("./extraction_balance_pdf");
const { scrapeGitHubData } = require("./scrapeGitHubData");
const { scrapePdfSapirColleg } = require("./scrapePdfSapirColleg");
const path = require("path");

async function mainProcess() {
  const usernameSapir = "Jango117";
  const passwordSapir = "password";
  const pdfPath = path.join(__dirname, "downloads_balance/Jango117grades.pdf");
  const id = "123456789";
  const usernameGitHub = "MorazTamir";

  //   await scrapePdfSapirColleg(username, password);
  const { studentInfo, courses } = await extraction_balance_pdf(pdfPath);
  //const { useInfo, summary } = await scrapeGitHubData(id, usernameGitHub);

  return { studentInfo };
}

module.exports = { mainProcess };
