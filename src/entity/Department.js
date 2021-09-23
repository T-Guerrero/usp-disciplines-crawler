export default class Department {
  constructor(name, initials, url) {
    this.name = name;
    this.initials = initials;
    this.url = url;

    this.disciplines = [];
  }

  addDiscipline(newDiscipline) {
    this.disciplines.push(newDiscipline);
  }
}
