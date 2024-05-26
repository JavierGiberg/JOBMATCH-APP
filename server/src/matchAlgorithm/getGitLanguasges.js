const Database = require("../../DataBase/DBConnection");

const getGitLanguasges = async (studentId) => {
  const dbConnection = Database.getInstance();
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `SELECT * FROM t_github_languages WHERE student_id = ?;`,
      [studentId],
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

module.exports = { getGitLanguasges };
