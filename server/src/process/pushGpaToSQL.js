const Database = require("../../DataBase/DBConnection");

async function pushGpaToSQL(studentId, programming, algorithm, cyber, math) {
  const dbConnection = Database.getInstance();

  math = isNaN(math) ? 0 : math;
  programming = isNaN(programming) ? 0 : programming;
  algorithm = isNaN(algorithm) ? 0 : algorithm;
  cyber = isNaN(cyber) ? 0 : cyber;

  const gpaQuery = `
  INSERT INTO t_gpa (id, programming, algorithm, cyber, math)
  VALUES (?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    id = VALUES(id),
    programming = VALUES(programming),
    algorithm = VALUES(algorithm),
    cyber = VALUES(cyber),
    math = VALUES(math);
`;

  await dbConnection.query(gpaQuery, [
    studentId,
    programming,
    algorithm,
    cyber,
    math,
  ]);
}

module.exports = { pushGpaToSQL };
