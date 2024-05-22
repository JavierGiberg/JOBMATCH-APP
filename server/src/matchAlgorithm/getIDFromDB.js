const Database = require("../../DataBase/DBConnection");

const getIDFromDB = async (degree, major) => {
  const dbConnection = Database.getInstance();
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `SELECT DISTINCT id FROM t_student WHERE major = ? AND degree = ?;`,
      [major, degree],
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          reject(error);
        } else {
          resolve(results.map((row) => row.id));
        }
      }
    );
  });
};

module.exports = { getIDFromDB };
