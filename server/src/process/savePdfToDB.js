const Database = require("../../DataBase/DBConnection");

const saveDataToDB = async (studentInfo, courses) => {
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

  courses.forEach(async (course) => {
    const courseQuery = `
        INSERT INTO t_courses (student_id, course_name, grade)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          grade = VALUES(grade);
      `;

    await dbConnection.query(courseQuery, [
      studentInfo.id,
      course.course,
      course.grade,
    ]);
  });
};

module.exports = { saveDataToDB };