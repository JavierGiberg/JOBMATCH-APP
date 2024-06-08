const { getDataforNode } = require("./getDataforNode");
const { buildObject } = require("./buildObject");
const { distanceMatrix } = require("./distanceMatrix");

const mainSimilarStudents = async () => {
  console.log("mainSimilarStudents Start!");
  console.log("1.getDataforNode");
  const data = await getDataforNode();

  console.log("2.buildObject");
  const nodes = buildObject(data);

  console.log("3.disdistanceMatrix");
  const matrix = distanceMatrix(nodes);

  console.log(".return matrix");
  return matrix;
};

module.exports = { mainSimilarStudents };
