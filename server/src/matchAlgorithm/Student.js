class Student {
  id;
  name;
  degree;
  major;
  programming;
  algorithm;
  cyber;
  math;
  finScore;

  constructor(id) {
    this.id = id;
    this.finScore = 0;
  }

  get id() {
    return this.id;
  }

  get name() {
    return this.name;
  }
  set name(name) {
    this.name = name;
  }
  get programming() {
    return this.programming;
  }
  set programming(programing) {
    this.programming = programming;
  }
  get algorithm() {
    return this.algorithm;
  }
  set algorithm(algorithm) {
    this.algorithm = algorithm;
  }
  get cyber() {
    return this.cyber;
  }
  set cyber(cyber) {
    this.cyber = cyber;
  }
  get math() {
    return this.math;
  }
  set math(math) {
    this.math = math;
  }
  get finScore() {
    return this.finScore;
  }
  set finScore(finScore) {
    this.finScore = finScore;
  }
}

module.exports = Student;
