const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");
const saveDataToDB = require("./savePdfToDB");
const extraction_balance_pdf = async (pdfPath) => {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);

  const lines = data.text.split("\n").filter((line) => line.trim() !== "");

  const studentInfo = {
    id: lines[8],
    name: lines[9],
    address: lines[10],
    phone: lines[11],
    email: lines[17],
    major: lines[20].substring(0, 1),
    status: lines[18],
    degree: lines[19],
    english: lines[7],
  };

  const coursesLines = data.text
    .split("שיעור")
    .filter((line) => line.trim() !== "");
  const courses = [];

  coursesLines.forEach((element, index) => {
    if (index != 0) {
      const current = element.split("\n").filter((line) => line.trim() !== "");
      const gradeValue = extractGrade(current);
      const course = {
        course: current[2],
        grade: gradeValue,
      };
      courses.push(course);
    }
  });
  saveDataToDB.saveDataToDB(studentInfo, courses);
  return { studentInfo, courses };
};

const extractGrade = (current) => {
  const handleGrade = current[0].split(".");
  if (handleGrade[1].length == 3 && handleGrade[2].substring(2, 5) == "עבר") {
    return "עבר";
  } else if (handleGrade[1].length == 3) {
    return "בתהליך למידה";
  }
  if (handleGrade[1].length == 5) {
    return handleGrade[1].substring(2, 4);
  }
  if (handleGrade[1].length == 6) {
    return handleGrade[1].substring(2, 5);
  }
};

//debugger
// const pdfPath = path.join(__dirname, "downloads_balance/Jango117grades.pdf");
// extraction_balance_pdf(pdfPath);

module.exports = { extraction_balance_pdf };
