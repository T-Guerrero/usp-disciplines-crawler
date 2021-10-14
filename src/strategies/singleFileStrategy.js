import {
  startDriver,
  closeDriver,
  fetchDepartmentsByInstitute,
  fetchDisciplinesByDepartment,
  fetchPreRequisitesByDiscipline,
  fetchInstitutesLinks,
} from '../driver.js';

export default class SingleFileStrategy {
  constructor() {
    this.data = [];
    this.saveMethod = undefined;
  }

  async setSaveMethod(method) {
    this.saveMethod = method;
  }

  async run(initialUrl) {
    await this.#getDepartments(initialUrl);
    console.log('Departments Fetched!');

    await this.#getDisciplines();
    console.log('Disciplines Fetched!');

    await this.#getPreReqs();
    console.log('PreRequisites Fetched!');
    this.saveMethod(this.data, 'data');
  }

  async #getDepartments(url) {
    await startDriver();
    const institutes = await fetchInstitutesLinks(url);

    for (let link of institutes) {
      const departments = await fetchDepartmentsByInstitute(link);
      if (departments != null) {
        this.data = this.data.concat(departments);
      }
    }
    await closeDriver();
  }

  async #getDisciplines() {
    await startDriver();
    for (let i in this.data) {
      const department = this.data[i];
      const disciplines = await fetchDisciplinesByDepartment(department.url);
      if (disciplines != null) {
        department.disciplines = disciplines;
      }
    }
    await closeDriver();
  }

  async #getPreReqs() {
    for (let i in this.data) {
      await startDriver();
      const department = this.data[i];
      for (let j in department.disciplines) {
        if (j == department.disciplines.length / 2) {
          // avoid session timeout
          await closeDriver();
          await startDriver();
        }
        const preReqs = await fetchPreRequisitesByDiscipline(
          department.disciplines[j].url
        );
        if (preReqs != null) {
          department.disciplines[i].requisites = preReqs;
        }
      }
      await closeDriver();
    }
  }
}
