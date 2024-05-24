const Database = require("../../DataBase/DBConnection");
const Student = require("./Student");

const getGpaFromDB = async (studentIds, degree, major) => {
  const dbConnection = Database.getInstance();
  const students = [];

  studentIds.forEach((studentId) => {
    students.push(new Student(studentId));
  });

  await Promise.all(
    students.map((student) => {
      return new Promise((resolve, reject) => {
        dbConnection.query(
          `SELECT t_gpa.*, t_student.name
          FROM t_gpa
          JOIN t_student ON t_gpa.id = t_student.id;`,
          [student.id],
          (error, results) => {
            if (error) {
              console.error("Error executing query:", error);
              reject(error);
            } else {
              if (results.length > 0) {
                student.degree = degree;
                student.major = major;
                student.name = results[0].name;
                student.programming = results[0].programming;
                student.algorithm = results[0].algorithm;
                student.cyber = results[0].cyber;
                student.math = results[0].math;
              }
              resolve();
            }
          }
        );
      });
    })
  );

  return students;
};

module.exports = { getGpaFromDB };
