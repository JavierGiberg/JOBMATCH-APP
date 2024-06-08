const buildObject = (data) => {
  const node = data.map((row) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar_url,
    vector: [row.programming, row.algorithm, row.cyber, row.math],
  }));
  return node;
};
module.exports = { buildObject };
