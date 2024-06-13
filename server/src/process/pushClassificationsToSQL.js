const Database = require('./dbConnection'); // Adjust the path as necessary
const { classifyProjectArea } = require('./classifyProject');
const { getDependencies } = require('./getDependencies');

async function pushClassificationsToSQL(studentUsername) {
    const connection = Database.getInstance();

    try {
        const dependencies = await getDependencies(studentUsername);
        if (dependencies.length === 0) {
            console.log('No dependencies found for the projects.');
            return;
        }

        const classifications = await classifyProjectArea(dependencies);

        classifications.forEach((classification, index) => {
            connection.query(
                'UPDATE t_github_info SET classification = ? WHERE name = ?',
                [classification, studentUsername],
                (error, results) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        return;
                    }
                    console.log(`Updated classification for ${studentUsername}: ${classification}`);
                }
            );
        });
    } catch (error) {
        console.error('Error pushing classification to SQL:', error);
    }
}

module.exports = { pushClassificationsToSQL };