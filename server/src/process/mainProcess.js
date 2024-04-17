const { extraction_balance_pdf } = require("./extraction_balance_pdf");
const { scrapeGitHubData } = require("./scrapeGitHubData");
const { scrapePdfSapirColleg } = require("./scrapePdfSapirColleg");

async function mainProcess() {
  const usernameSapir = "Jango117";
  const passwordSapir = "password";
  const pdfPath = "server\\src\\process\\downloads_balance\\Jango117grades.pdf";
  const id = "302280383";
  const usernameGitHub = "JavierGiberg";

  //   await scrapePdfSapirColleg(username, password);
  const { studentInfo, courses } = await extraction_balance_pdf(pdfPath);
  const { useInfo, summary } = await scrapeGitHubData(id, usernameGitHub);

  return { summary };
}

module.exports = { mainProcess };
