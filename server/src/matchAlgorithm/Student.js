class Student {
  #id;
  #name;
  #degree;
  #major;
  #programing;
  #algorithm;
  #cyber;
  #math;
  #finScore;

  constructor(id) {
    this.#id = id;
    this.#finScore = 0;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }
  set name(name) {
    this.#name = name;
  }
  get programing() {
    return this.#programing;
  }
  set programing(programing) {
    this.#programing = programing;
  }
  get algorithm() {
    return this.#algorithm;
  }
  set algorithm(algorithm) {
    this.#algorithm = algorithm;
  }
  get cyber() {
    return this.#cyber;
  }
  set cyber(cyber) {
    this.#cyber = cyber;
  }
  get math() {
    return this.#math;
  }
  set math(math) {
    this.#math = math;
  }
  get finScore() {
    return this.#finScore;
  }
  set finScore(finScore) {
    this.#finScore = finScore;
  }
}

module.exports = Student;
