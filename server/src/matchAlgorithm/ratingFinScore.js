const { getGitLanguasges } = require("./getGitLanguasges");

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

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const ratingFinScore = async (StudentsBeforeRating, preferences) => {
  const defaultWeights = {
    programming: 0.35,
    algorithm: 0.2,
    cyber: 0.15,
    math: 0.1,
  };

  const dynamicWeights = {};
  const weights = [0.35, 0.2, 0.15, 0.1];

  preferences.order.forEach((area, index) => {
    dynamicWeights[area] = weights[index];
  });

  for (const student of StudentsBeforeRating) {
    const languages = await getGitLanguasges(student.id);

    student.finScore = 0;

    const programmingScore = calculateWeightedScore(
      student.programming,
      dynamicWeights.programming || defaultWeights.programming
    );
    const algorithmScore = calculateWeightedScore(
      student.algorithm,
      dynamicWeights.algorithm || defaultWeights.algorithm
    );
    const cyberScore = calculateWeightedScore(
      student.cyber,
      dynamicWeights.cyber || defaultWeights.cyber
    );
    const mathScore = calculateWeightedScore(
      student.math,
      dynamicWeights.math || defaultWeights.math
    );

    student.finScore =
      programmingScore + algorithmScore + cyberScore + mathScore;
    student.finScore = parseFloat(student.finScore.toFixed(2));

    for (const language of preferences.languages) {
      const matchedLanguage = languages.find((l) => l.language === language);
      if (matchedLanguage) {
        const projectScore = getGithubProjectScore(
          matchedLanguage.projects_count
        );
        student.finScore += projectScore;
      }
    }

    // Clamp the final score to be within 0 to 100
    student.finScore = clamp(student.finScore, 0, 100);
  }

  return StudentsBeforeRating;
};

module.exports = { ratingFinScore };
