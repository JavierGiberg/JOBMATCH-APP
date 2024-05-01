const crypto = require("crypto");

// הגדרת האלגוריתם, מפתח ההצפנה וה-IV (Initialization Vector)
const algorithm = "aes-256-cbc";
const password = "password12345678"; // סיסמה צריכה להיות באורך 32 תווים ל-aes-256-cbc
const key = crypto.scryptSync(password, "salt", 32); // יצירת מפתח מהסיסמה
const iv = crypto.randomBytes(16); // יצירת IV אקראי

// פונקציה להצפנה
function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
}

// פונקציה לפענוח
function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
