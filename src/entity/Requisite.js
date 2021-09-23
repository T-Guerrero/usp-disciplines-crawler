export class RequisitesByCourse {
  constructor(courseCode) {
    this.courseCode = courseCode;
    this.disciplines = [];
  }

  addRequisite(newRequisite) {
    this.disciplines.push(newRequisite);
  }
}

export class Requisite {
  constructor(discipline, type) {
    this.discipline = discipline;
    this.type = type;
  }
}
