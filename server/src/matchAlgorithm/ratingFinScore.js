//
//
// const preferences = {
//     gpa: { programming: 1, algorithm: 2, cyber: 3, math: 4 },
//     languages: ["JavaScript", "C#", "CSS"],
//   };
const { getGitLanguasges } = require("./getGitLanguasges");

const ratingFinScore = async (StudentsBeforeRating, preferences) => {
  const score = [0, 1, 0.8, 0.6, 0.4];

  const programmingRating = score[preferences.gpa.programming];
  const algorithmRating = score[preferences.gpa.algorithm];
  const cyberRating = score[preferences.gpa.cyber];
  const mathRating = score[preferences.gpa.math];

  for (const student of StudentsBeforeRating) {
    const languages = await getGitLanguasges(student.id);
    student.finScore += student.programming * programmingRating;
    student.finScore += student.algorithm * algorithmRating;
    student.finScore += student.cyber * cyberRating;
    student.finScore += student.math * mathRating;
    student.finScore = parseInt(student.finScore);

    for (const language of preferences.languages) {
      const matchedLanguage = languages.find((l) => l.language === language);
      if (matchedLanguage) {
        student.finScore += 2 * matchedLanguage.projects_count;
      }
    }
  }

  return StudentsBeforeRating;
};

module.exports = { ratingFinScore };
