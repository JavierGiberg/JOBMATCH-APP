const Database = require('../../DataBase/DBConnection');

async function getClassificationsFromSQL(connection, username) {
  if (!connection) {
    throw new Error("Database connection is not defined");
  }

  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM t_classifications WHERE studentUsername = ?';
    connection.query(query, [username], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
}


// Main function to run and test getClassificationsFromSQL
async function main() {
  const testUsername = 'JavierGiberg'; // Replace with the actual username you want to test
  try {
    const classifications = await getClassificationsFromSQL(testUsername);
  } catch (error) {
    console.error('Error in main:', error);
  }
}

// Check if the script is being run directly
if (require.main === module) {
  main();
}

module.exports = { getClassificationsFromSQL } ;