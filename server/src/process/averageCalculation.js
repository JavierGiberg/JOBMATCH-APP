const { PullSemiProfile } = require("../process/PullSemiProfile");
const categoriesJson = require("./courses.json");
const { pushGpaToSQL } = require("./pushGpaToSQL");

const averageCalculation = async (studentId) => {
  const Data = await PullSemiProfile(studentId);

  const courses = Data.courses;
  const programming = { grade: 0, counter: 0, gpa: 0 };
  const algorithm = { grade: 0, counter: 0, gpa: 0 };
  const math = { grade: 0, counter: 0, gpa: 0 };
  const cyber = { grade: 0, counter: 0, gpa: 0 };

  courses.forEach((course) => {
    const category = getCategory(course.course_name);
    if (
      category == "programming" &&
      !(course.grade == "עבר" || course.grade == "בתהליך למידה")
    ) {
      programming.counter++;
      programming.grade += Number(course.grade);
      return;
    }
    if (
      category == "algorithm" &&
      !(course.grade == "עבר" || course.grade == "בתהליך למידה")
    ) {
      algorithm.counter++;
      algorithm.grade += Number(course.grade);
      return;
    }
    if (
      category == "cyber" &&
      !(course.grade == "עבר" || course.grade == "בתהליך למידה")
    ) {
      cyber.counter++;
      cyber.grade += Number(course.grade);
      return;
    }
    if (
      category == "math" &&
      !(course.grade == "עבר" || course.grade == "בתהליך למידה")
    ) {
      math.counter++;
      math.grade += Number(course.grade);
      return;
    }
  });

  programming.gpa = Number(
    (programming.grade / programming.counter).toFixed(2)
  );
  algorithm.gpa = Number((algorithm.grade / algorithm.counter).toFixed(2));
  cyber.gpa = Number((cyber.grade / cyber.counter).toFixed(2));
  math.gpa = Number((math.grade / math.counter).toFixed(2));

  pushGpaToSQL(studentId, programming.gpa, algorithm.gpa, cyber.gpa, math.gpa);
  console.log("pushGpaToSQL DONE!");
};

const getCategory = (courseName) => {
  for (const category in categoriesJson) {
    for (const keyword of categoriesJson[category]) {
      if (courseName.includes(keyword)) {
        return category;
      }
    }
  }
  return "?";
};

module.exports = { averageCalculation };
