const Database = require("../../DataBase/DBConnection");

const getDataforNode = async (degree, major) => {
  const dbConnection = Database.getInstance();
  return new Promise((resolve, reject) => {
    dbConnection.query(
      `SELECT t_gpa.*, t_github_info.avatar_url, t_student.name
      FROM t_gpa
      JOIN t_github_info ON t_gpa.id = t_github_info.id
      JOIN t_student ON t_gpa.id = t_student.id;
        `,
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          reject(error);
        } else {
          resolve(results.map((row) => row));
        }
      }
    );
  });
};

module.exports = { getDataforNode };
