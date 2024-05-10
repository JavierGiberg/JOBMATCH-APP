const Database = require("../../DataBase/DBConnection");
const { encrypt } = require("../cryptoPassword/crypto");
const dbConnection = Database.getInstance();
const util = require("util");
const query = util.promisify(dbConnection.query).bind(dbConnection);

const registerStudents = async (
  academic,
  username,
  password,
  githubUsername,
  email
) => {
  try {
    const selectQuery = `SELECT * FROM t_student WHERE email = ?;`;
    const selectResult = await query(selectQuery, [email]);

    if (selectResult.length > 0) {
      console.error("User already exists");
      return "User already exists";
    } else {
      const encrypted = encrypt(password);
      const insertQuery = `INSERT INTO t_register (academic, username, githubUsername, iv, encryptedData)
                           VALUES (?, ?, ?, ?, ?)
                           ON DUPLICATE KEY UPDATE
                           academic = VALUES(academic),
                           username = VALUES(username),
                           githubUsername = VALUES(githubUsername),
                           iv = VALUES(iv),
                           encryptedData = VALUES(encryptedData);`;
      await query(insertQuery, [
        academic,
        username,
        githubUsername,
        encrypted.iv,
        encrypted.encryptedData,
      ]);
      console.log("Data pushed to db DONE!!!");

      return "success";
    }
  } catch (error) {
    console.error("Error: ", error);
    return "failed";
  }
};

module.exports = registerStudents;
