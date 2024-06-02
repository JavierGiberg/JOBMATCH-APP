const understandQuestion = (message) => {
  const normalizedMessage = message.toLowerCase().trim();
  if (normalizedMessage.includes("כמה סטודנטים")) {
    return "student_count";
  }
  if (
    normalizedMessage.includes("קורס") &&
    (normalizedMessage.includes("בוגר") ||
      normalizedMessage.includes("בוגרים") ||
      normalizedMessage.includes("סיים") ||
      normalizedMessage.includes("למד") ||
      normalizedMessage.includes("לומד"))
  ) {
    return "course";
  }

  return "unknown";
};
module.exports = { understandQuestion };
