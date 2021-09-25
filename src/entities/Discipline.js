export default class Discipline {
  constructor(name, code, url) {
    this.name = name;
    this.code = code;
    this.url = url;

    this.requisites = [];
  }
}
