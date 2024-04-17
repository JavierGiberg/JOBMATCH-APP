const mysql = require("mysql");
const axios = require("axios");
const Database = require("../../DataBase/DBConnection");

async function pushGithubDataToSQL(userInfo, summary) {
  const dbConnection = Database.getInstance();
  try {
    const sqlInfo = `
            INSERT INTO t_github_info (id, name, avatar_url, followers, following, public_repos)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                avatar_url = VALUES(avatar_url),
                followers = VALUES(followers),
                following = VALUES(following),
                public_repos = VALUES(public_repos);
        `;

    await dbConnection.query(sqlInfo, [
      userInfo.id,
      userInfo.name,
      userInfo.avatar_url,
      userInfo.followers,
      userInfo.following,
      userInfo.public_repos,
    ]);

    for (const [language, count] of Object.entries(summary.languages)) {
      console.log(
        `userInfo.id: ${userInfo.id}, Language: ${language}, Count: ${count}`
      );
      const sqlSummary = `
                INSERT INTO t_github_languages (student_id, language, projects_count)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    projects_count = VALUES(projects_count);
            `;
      await dbConnection.query(sqlSummary, [userInfo.id, language, count]);
    }

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Failed to insert data:", error);
  } finally {
    dbConnection.end(); // Consider connection pooling for better performance in production
  }
}

module.exports = { pushGithubDataToSQL };
