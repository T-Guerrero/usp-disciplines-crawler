export default class Discipline {
  constructor(name, initials, url) {
    this.name = name;
    this.initials = initials;
    this.url = url;

    this.requisites = [];
  }
}
