export default class Department {
  constructor(name, code, url) {
    this.name = name;
    this.code = code;
    this.url = url;

    this.disciplines = [];
  }
}
