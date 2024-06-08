const calculateEuclideanDistance = (vector1, vector2) => {
  if (vector1.length !== vector2.length) {
    throw new Error("Vectors must be of the same length");
  }

  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
    sum += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(sum).toFixed(2);
};

const distanceMatrix = (nodes) => {
  const matrix = Array(nodes.length)
    .fill(null)
    .map(() => Array(nodes.length).fill(0));

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j) {
        const distance = calculateEuclideanDistance(
          nodes[i].vector,
          nodes[j].vector
        );
        matrix[i][j] = {
          id: nodes[j].id,
          name: nodes[j].name,
          avatar: nodes[j].avatar,
          distance: distance,
        };
      } else {
        matrix[i][j] = {
          id: nodes[i].id,
          name: nodes[i].name,
          avatar: nodes[i].avatar,
          distance: 0,
        };
      }
    }
  }

  return matrix;
};

module.exports = { distanceMatrix };
