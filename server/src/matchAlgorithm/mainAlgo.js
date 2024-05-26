const { getIDFromDB } = require("./getIDFromDB");
const { getGpaFromDB } = require("./getGpaFromDB");
const { ratingFinScore } = require("./ratingFinScore");

const mainAlgo = async (degree, major, preferences) => {
  console.log("JOBMATCH Algorithm Start!");

  console.log("getIDFromDB Start!");
  const studentIds = await getIDFromDB(degree, major);

  console.log("getGpaFromDB Start!");
  const StudentsBeforeRating = await getGpaFromDB(studentIds, degree, major);

  console.log("ratingFinScore Start!");
  const Students = await ratingFinScore(StudentsBeforeRating, preferences);

  console.log("JOBMATCH Algorithm DONE!");
  return Students;
};

module.exports = { mainAlgo };
