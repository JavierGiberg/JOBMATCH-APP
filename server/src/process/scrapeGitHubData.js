const axios = require("axios");
const { pushGithubDataToSQL } = require("./pushGithubDataToSQL");

async function scrapeGitHubData(userId, username) {
  const config = {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN_API}`,
    },
  };

  try {
    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`,
      config
    );
    const userReposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      config
    );

    const user = userResponse.data;
    const repos = userReposResponse.data;

    const userInfo = {
      id: userId,
      name: user.login,
      avatar_url: user.avatar_url,
      followers: user.followers,
      following: user.following,
      public_repos: user.public_repos,
    };

    const summary = await summarizeLanguages(repos, config);

    await pushGithubDataToSQL(userInfo, summary);
    return { userInfo, summary };
  } catch (error) {
    console.error("Error in scraping GitHub Data:", error);
    return null; // or handle differently depending on your application's needs
  }
}

module.exports = { scrapeGitHubData };

async function summarizeLanguages(repos, config) {
  const summary = {
    languages: {},
  };

  for (const repo of repos) {
    try {
      const responses = await axios.get(repo.languages_url, config);
      const languages = Object.keys(responses.data);
      for (const language of languages) {
        if (summary.languages[language]) {
          summary.languages[language]++;
        } else {
          summary.languages[language] = 1;
        }
      }
    } catch (error) {
      console.error(`Error fetching languages for repo: ${repo.name}`, error);
    }
  }
  return summary;
}
