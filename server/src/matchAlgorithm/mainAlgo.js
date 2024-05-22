const { getIDFromDB } = require("./getIDFromDB");

const mainAlgo = async (degree, major) => {
  const studentIds = await getIDFromDB(degree, major);

  console.log(`ids from mainAlgo: ${studentIds}`);
};

module.exports = { mainAlgo };
