const Database = require("../../DataBase/DBConnection");

const pushAcademicDataToSQL = async (studentInfo, courses) => {
  try {
    const dbConnection = Database.getInstance();
    const studentQuery = `
      INSERT INTO t_student (id, name, address, phone, email, major, status, degree, english)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        address = VALUES(address),
        phone = VALUES(phone),
        email = VALUES(email),
        major = VALUES(major),
        status = VALUES(status),
        degree = VALUES(degree),
        english = VALUES(english);
    `;

    await dbConnection.query(studentQuery, [
      studentInfo.id,
      studentInfo.name,
      studentInfo.address,
      studentInfo.phone,
      studentInfo.email,
      studentInfo.major,
      studentInfo.status,
      studentInfo.degree,
      studentInfo.english,
    ]);
    const courseQuery = `
        INSERT INTO t_courses (student_id, course_name, grade)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          grade = VALUES(grade);
      `;
    for (const course of courses) {
      await dbConnection.query(courseQuery, [
        studentInfo.id,
        course.course,
        course.grade,
      ]);
    }
  } catch (error) {
    console.log("error in pushAcademicDataToSQL: DUPLICATE");
  }
};

module.exports = { pushAcademicDataToSQL };
