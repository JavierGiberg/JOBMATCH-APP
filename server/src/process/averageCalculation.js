const { getGitLanguasges } = require("./../matchAlgorithm/getGitLanguasges");
const getClassificationsFromSQL = require('./getClassificationsFromSQL');

const calculateWeightedScore = (score, weight) => {
  return score * weight;
};

const getGithubProjectScore = (projectsCount) => {
  if (projectsCount >= 1 && projectsCount <= 5) return 1; // Beginner
  if (projectsCount >= 6 && projectsCount <= 14) return 4; // Intermediate
  if (projectsCount >= 15 && projectsCount <= 19) return 6; // Pro
  if (projectsCount >= 20) return 9; // Master
  return 0;
};

const getClassificationRankScore = (count) => {
  if (count >= 1 && count <= 2) return 2; // Beginner
  if (count >= 3 && count <= 5) return 5; // Intermediate
  if (count >= 6 && count <= 9) return 7; // Pro
  if (count >= 10) return 10; // Master
  return 0;
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const ratingFinScore = async (StudentsBeforeRating, preferences) => {
  const gradeWeights = {
    'full stack development': 0.25,
    'cyber': 0.2,
    'algorithms': 0.1,
    'game programming': 0.05,
    'math': 0
  };

  const dynamicGradeWeights = {};
  const weights = [0.25, 0.2, 0.1, 0.05, 0];

  preferences.order.forEach((area, index) => {
    dynamicGradeWeights[area] = weights[index];
  });

  // Fetch classifications once before the loop
  const classifications = await getClassificationsFromSQL();

  for (const student of StudentsBeforeRating) {
    const languages = await getGitLanguasges(student.id);

    student.finScore = 0;

    const primaryArea = preferences.order[0];

    // Add classification score only for the primary area
    const studentClassifications = classifications.filter(
      (classification) => classification.studentUsername === student.username
    );

    let classificationScore = 0;
    let count = 0;
    studentClassifications.forEach(classification => {
      if (classification.classification.toLowerCase() === primaryArea.toLowerCase()) {
        count++;
      }
    });

    classificationScore = getClassificationRankScore(count) * 0.2; // 20% weight for classifications

    let gradeScore = 0;
    const programmingScore = calculateWeightedScore(
      student.programming,
      dynamicGradeWeights['full stack development'] || gradeWeights['full stack development']
    );
    const algorithmScore = calculateWeightedScore(
      student.algorithm,
      dynamicGradeWeights.algorithms || gradeWeights.algorithms
    );
    const cyberScore = calculateWeightedScore(
      student.cyber,
      dynamicGradeWeights.cyber || gradeWeights.cyber
    );
    const gameProgrammingScore = calculateWeightedScore(
      student.gameProgramming,
      dynamicGradeWeights['game programming'] || gradeWeights['game programming']
    );
    const mathScore = calculateWeightedScore(
      student.math,
      dynamicGradeWeights.math || gradeWeights.math
    );

    gradeScore += (programmingScore + algorithmScore + cyberScore + gameProgrammingScore + mathScore) * 0.6; // 60% weight for grades
    gradeScore = parseFloat(gradeScore.toFixed(2));

    let githubScore = 0;
    for (const language of preferences.languages) {
      const matchedLanguage = languages.find((l) => l.language === language);
      if (matchedLanguage) {
        const projectScore = getGithubProjectScore(matchedLanguage.projects_count);
        githubScore += projectScore * 0.2; // 20% weight for GitHub
      }
    }

    // Combine all scores
    student.finScore = gradeScore + githubScore + classificationScore;

    // Clamp the final score to be within 0 to 100
    student.finScore = clamp(student.finScore, 0, 100);
  }

  return StudentsBeforeRating;
};

module.exports = { ratingFinScore };