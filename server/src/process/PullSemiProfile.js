const mysql = require("mysql");
const Database = require("../../DataBase/DBConnection");
const dbConnection = Database.getInstance();

const PullSemiProfile = async (studentId) => {
  const studentQuery = `SELECT * FROM t_student WHERE id = ?`;
  const coursesQuery = `SELECT * FROM t_courses WHERE student_id = ?`;
  const githubQuery = `SELECT g.*, l.language, l.projects_count FROM t_github_info g LEFT JOIN t_github_languages l ON g.id = l.student_id WHERE g.id = ?`;

  const studentInfoPromise = queryDatabase(studentQuery, studentId);
  const coursesPromise = queryDatabase(coursesQuery, studentId);
  const githubInfoPromise = queryDatabase(githubQuery, studentId);

  try {
    const studentInfo = await studentInfoPromise;
    const courses = await coursesPromise;
    const githubInfo = await githubInfoPromise;

    // Construct the github languages array
    const githubLanguages = githubInfo.map((info) => ({
      language: info.language,
      projects_count: info.projects_count,
    }));

    // Remove duplicates from the githubLanguages array if needed
    const uniqueGithubLanguages = Array.from(
      new Set(githubLanguages.map(JSON.stringify))
    ).map(JSON.parse);

    // Count the number of projects in each category
    const projectsCount = uniqueGithubLanguages.reduce((acc, curr) => {
      switch (curr.language.toLowerCase()) {
        case 'programming':
          acc.programming += curr.projects_count;
          break;
        case 'algorithm':
          acc.algorithm += curr.projects_count;
          break;
        case 'cyber':
          acc.cyber += curr.projects_count;
          break;
        case 'math':
          acc.math += curr.projects_count;
          break;
        default:
          break;
      }
      return acc;
    }, { programming: 0, algorithm: 0, cyber: 0, math: 0 });

    // Construct the final object
    const Data = {
      student: studentInfo[0], // assuming the query returns an array
      courses: courses,
      github_info: {
        id: studentId,
        name: githubInfo[0].name,
        avatar_url: githubInfo[0].avatar_url,
        followers: githubInfo[0].followers,
        following: githubInfo[0].following,
        public_repos: githubInfo[0].public_repos,
      },
      github_languages: uniqueGithubLanguages,
      projects_count: projectsCount,
    };

    return Data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Helper function to perform a database query
function queryDatabase(query, params) {
  return new Promise((resolve, reject) => {
    dbConnection.query(query, [params], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
}

module.exports = { PullSemiProfile };