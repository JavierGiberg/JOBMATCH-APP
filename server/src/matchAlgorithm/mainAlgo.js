const { getIDFromDB } = require("./getIDFromDB");
const Student = require("./Student");

const mainAlgo = async (degree, major) => {
  const studentIds = await getIDFromDB(degree, major);

  const students = [];

  studentIds.forEach((studentId) => {
    students.push(new Student(studentId));
  });

  students.forEach((e) => {
    console.log("students array :" + e.id);
  });

  // console.log(`ids from mainAlgo: ${studentIds}`);
};

module.exports = { mainAlgo };
