const path = require("path");
const fs = require("fs");
require("dotenv").config({
  path: require("path").join(__dirname, "./.env"),
});
const { Page } = require("puppeteer-core");
const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: process.env.SOLVE_CAPTCHA_API_KEY,
    },
    visualFeedback: true,
  })
);

async function scrapePdfSapirCollege(username, password) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--window-size=1920,1080", "--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(
    "https://ids.sapir.ac.il/nidp/app/login?id=sapirloa2&sid=1&option=credential&sid=1&target=https%3A%2F%2Fis.sapir.ac.il%2Fportal%2F"
  );

  await sleep(3);
  console.log("enterUserName");
  const enterUserName = await page.waitForSelector("#Ecom_User_ID");
  await enterUserName.type("Jango117", { delay: 100 });
  await page.click("#loginButton");

  await page.solveRecaptchas();
  try {
    await Promise.all([page.waitForNavigation(), page.click(`#loginButton`)]);
  } catch (error) {}
  console.log("solve reCAPTCHAs DONE!");
  // scrape PDF

  await sleep(5);
  await page.click(`#ldapPasswordCard`);

  await sleep(5);
  const ldapPassword = await page.waitForSelector("#ldapPassword");
  await ldapPassword.type(password, { delay: 100 });
  console.log("ldapPassword");
  await page.click(`#ldapPasswordLoginButton`);
  await sleep(3);

  const privateZone = await page.waitForSelector(
    '::-p-xpath(//a[@title="רישום לקורסים, מערכת שעות, ציונים, הגשת בקשות"])'
  );
  await privateZone.click();
  await sleep(3);
  console.log("privateZone");
  const grades = await page.waitForSelector(
    '::-p-xpath(//r-button[@routerlink="grades"])'
  );
  await grades.click();

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: path.join(__dirname, "..", "downloads_balance"),
  });
  console.log("downloadPdf");
  const downloadPdf = await page.waitForSelector(
    '::-p-xpath(//button[@class="button mdc-button mdc-button--raised mat-mdc-raised-button mat-unthemed mat-mdc-button-base ng-star-inserted"])'
  );
  await downloadPdf.click();
  await sleep(3);
  const downloadPath = path.resolve(__dirname, "..", "downloads_balance");
  var newFilePath = "";
  console.log("downloadPdf DONE!");
  try {
    const originalFilename = "הציונים+שלי+-+גליון+ציונים.pdf";
    const originalFilePath = path.join(downloadPath, originalFilename);
    newFilePath = path.join(downloadPath, username + "grades.pdf");
    while (!fs.existsSync(originalFilePath)) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
    fs.renameSync(originalFilePath, newFilePath);
    console.log("newFilePath: " + newFilePath);
  } catch (error) {
    newFilePath = "Unable to download the file. Please try again.";
    console.log(newFilePath);
  }
  await page.close();
  console.log("scrapePdfSapirCollege DONE!");
  return newFilePath;
}

module.exports = { scrapePdfSapirCollege };

async function sleep(sec) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve();
    }, sec * 1000);
  });
}
