// answer.js
const Database = require("../../DataBase/DBConnection");
const dbConnection = Database.getInstance();
const categoriesJson = require("../process/courses.json");
const bodyParser = require("body-parser");
const answer = async (questionType, ids, message) => {
  let responseMessage = "אין לי תשובה עדיין...";

  if (questionType === "student_count") {
    const count = ids.length;
    responseMessage = `קיימים ${count} במאגר`;
    return responseMessage;
  }
  if (questionType === "course") {
    const course = getCategory(message);

    try {
      const results = await queryDatabase(
        `SELECT name 
         FROM t_student 
         WHERE id IN (
           SELECT student_id 
           FROM t_courses 
           WHERE course_name LIKE ? AND student_id IN (?)
         );`,
        [`%${course}%`, ids]
      );

      const allNames = results.map((row) => row.name);
      responseMessage = `הסטודנטים הם: ${allNames.join(", ")}`;
      console.log(responseMessage);
      return responseMessage;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  } else {
    return responseMessage;
  }
};

module.exports = { answer };

const getCategory = (courseName) => {
  for (const category in categoriesJson) {
    for (const keyword of categoriesJson[category]) {
      if (courseName.includes(keyword)) {
        return keyword;
      }
    }
  }
  return "?";
};

const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
