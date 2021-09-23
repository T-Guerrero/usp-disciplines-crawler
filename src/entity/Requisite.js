export class RequisitesByCourse {
  constructor(courseCode) {
    this.courseCode = courseCode;
    this.requisites = [];
  }

  addRequisite(newRequisite) {
    this.requisites.push(newRequisite);
  }
}

export class Requisite {
  constructor(discipline, type) {
    this.discipline = discipline;
    this.type = type;
  }
}
