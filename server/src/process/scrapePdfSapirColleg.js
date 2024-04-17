const { Builder, By, Key, until } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const path = require("path");
const fs = require("fs");
require("dotenv").config({
  path: require("path").join(__dirname, "./.env"),
});

async function scrapePdfSapirColleg(username, password) {
  var web = // Limud Aera
    "https://ids.sapir.ac.il/nidp/idff/sso?id=sapirloa2&sid=9&option=credential&sid=9&target=https%3A%2F%2Fis.sapir.ac.il%2Fportal%2F";

  const downloadPath = path.resolve(__dirname, "downloads_balance");

  let options = new Options();
  //options.addArguments("--headless");
  options.setUserPreferences({
    "download.default_directory": downloadPath,
    "download.prompt_for_download": false,
    "download.directory_upgrade": true,
    "safebrowsing.enabled": true,
  });
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Navigate to the website
    await driver.get(web);
    let inputUsername = await driver.findElement(By.id("Ecom_User_ID"));
    await inputUsername.sendKeys(username);
    await driver.sleep(5000);
    // await driver.takeScreenshot().then((data) => {
    //   // takeScreenshot
    //   saveScreenshotToAzure("screenshot.png", data);
    // });

    let btnLogin = await driver.findElement(By.id("loginButton"));
    await btnLogin.click();
    await driver.sleep(10000);

    // await driver.takeScreenshot().then((data) => {
    //   // takeScreenshot
    //   saveScreenshotToAzure("screenshot1.png", data);
    // });
    // Locate the password input field and set attribute values
    let btnLoginpass = await driver.findElement(By.id("ldapPasswordCard"));
    await driver.executeScript(
      "arguments[0].setAttribute('enabled', 'true'); arguments[0].setAttribute('active', 'true');",
      btnLoginpass
    );
    await driver.sleep(1000);
    await btnLoginpass.click();
    // await driver.takeScreenshot().then((data) => {
    //   // takeScreenshot
    //   saveScreenshotToAzure("screenshot2.png", data);
    // });

    await driver.sleep(1000);

    // Enter password
    let inputPassword = await driver.findElement(By.id("ldapPassword"));
    await inputPassword.sendKeys(password);
    await driver.sleep(1000);

    // Click the login button
    btnLogin = await driver.findElement(By.id("ldapPasswordLoginButton"));
    await btnLogin.click();
    await driver.sleep(1000);

    // Navigate to the private zone
    let privateZone = await driver.findElement(
      By.xpath('//a[@title="רישום לקורסים, מערכת שעות, ציונים, הגשת בקשות"]')
    );
    await privateZone.click();
    await driver.sleep(1000);

    // Navigate to the maazan section
    let maazanBtn = await driver.findElement(
      By.xpath('//r-button[@routerlink="grades"]')
    );
    await maazanBtn.click();
    await driver.sleep(1000);

    // Download PDF
    let downloadPdf = await driver.findElement(
      By.xpath(
        '//button[@class="button mdc-button mdc-button--raised mat-mdc-raised-button mat-unthemed mat-mdc-button-base ng-star-inserted"]'
      )
    );
    await downloadPdf.click();
    await driver.sleep(10000);
  } finally {
    await driver.quit();
    const originalFilename = "הציונים+שלי+-+גליון+ציונים.pdf";
    const originalFilePath = path.join(downloadPath, originalFilename);
    const newFilePath = path.join(downloadPath, username + "grades.pdf");
    while (!fs.existsSync(originalFilePath)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    fs.renameSync(originalFilePath, newFilePath);
    return newFilePath;
  }
}
module.exports = { scrapePdfSapirColleg };
