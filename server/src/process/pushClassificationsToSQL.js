const Database = require('../../DataBase/DBConnection');
const { classifyProjectArea } = require('./classifyProjects');
const { getDependencies } = require('./getDependencies');

async function setupTable(connection) {
    try {
        await new Promise((resolve, reject) => {
            connection.query(`
                CREATE TABLE IF NOT EXISTS t_classifications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    studentUsername VARCHAR(255) NOT NULL,
                    classification VARCHAR(255) NOT NULL
                )
            `, (error) => {
                if (error) {
                    console.error('Error creating table:', error);
                    reject(error);
                } else {
                    console.log('Successfully ensured table t_classifications exists.');
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error('Error in setupTable function:', error);
    }
}

async function resetAutoIncrement(connection) {
    try {
        await new Promise((resolve, reject) => {
            connection.query(
                'SELECT MAX(id) AS maxId FROM t_classifications',
                (error, results) => {
                    if (error) {
                        console.error('Error fetching max id:', error);
                        reject(error);
                    } else {
                        const maxId = results[0].maxId || 0;
                        connection.query(
                            `ALTER TABLE t_classifications AUTO_INCREMENT = ${maxId + 1}`,
                            (error) => {
                                if (error) {
                                    console.error('Error resetting auto-increment:', error);
                                    reject(error);
                                } else {
                                    console.log('Successfully reset auto-increment value.');
                                    resolve();
                                }
                            }
                        );
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error in resetAutoIncrement function:', error);
    }
}

async function pushClassificationsToSQL(connection, studentUsername) {
    try {
        await setupTable(connection);

        await new Promise((resolve, reject) => {
            connection.query(
                'DELETE FROM t_classifications WHERE studentUsername = ?',
                [studentUsername],
                (error, results) => {
                    if (error) {
                        console.error('Error deleting existing rows:', error);
                        reject(error);
                    } else {
                        console.log(`Deleted ${results.affectedRows} rows for ${studentUsername}`);
                        resolve(results);
                    }
                }
            );
        });

        await resetAutoIncrement(connection);

        const dependenciesByProject = await getDependencies(studentUsername);
        for (const { projectName, dependencies } of dependenciesByProject) {
            if (dependencies.length === 0) {
                console.log(`No dependencies found for the project: ${projectName}.`);
                continue;
            }

            const classification = await classifyProjectArea(projectName, dependencies);

            console.log('Classification to be inserted:', classification); // Log classification

            await new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO t_classifications (studentUsername, classification) VALUES (?, ?)',
                    [studentUsername.toString(), classification.toString()],
                    (error, results) => {
                        if (error) {
                            console.error('Error executing query:', error);
                            reject(error);
                        } else {
                            console.log(`Inserted classification for ${studentUsername}: ${classification}`);
                            resolve(results);
                        }
                    }
                );
            });
        }
        console.log('Successfully pushed all classifications to SQL.');
    } catch (error) {
        console.error('Error pushing classification to SQL:', error);
    }
}

module.exports = { pushClassificationsToSQL };