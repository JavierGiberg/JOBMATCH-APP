const { getIDFromDB } = require("./getIDFromDB");
const { getGpaFromDB } = require("./getGpaFromDB");

const mainAlgo = async (degree, major) => {
  const studentIds = await getIDFromDB(degree, major);

  const StudentsArray = await getGpaFromDB(studentIds, degree, major);
  console.log(StudentsArray);
};

module.exports = { mainAlgo };
