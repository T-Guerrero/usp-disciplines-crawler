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
    this.data = {};
    this.saveMethod = undefined;
  }

  async setSaveMethod(method) {
    this.saveMethod = method;
  }

  async run(initialUrl) {
    await this.#getDepartments(initialUrl);
    console.log('Departments Fetched!');

    const departments = Object.values(this.data);
    await this.#getDisciplines(departments);
    console.log('Disciplines Fetched!');

    await this.#getPreReqs(departments);
    console.log('PreRequisites Fetched!');
    this.saveMethod(this.data, 'data');
  }

  async #getDepartments(url) {
    await startDriver();
    const institutes = await fetchInstitutesLinks(url);

    for (let link of institutes) {
      const departments = await fetchDepartmentsByInstitute(link);
      if (departments != null) {
        for (let department of departments)
          this.data[department.code] = department;
      }
    }
    await closeDriver();
  }

  async #getDisciplines(departments) {
    await startDriver();
    for (let department of departments) {
      const disciplines = await fetchDisciplinesByDepartment(department.url);
      if (disciplines != null) {
        this.data[department.code].disciplines = disciplines;
      }
    }
    await closeDriver();
  }

  async #getPreReqs(departments) {
    for (let department of departments) {
      await startDriver();
      for (let i in department.disciplines) {
        if (i == department.disciplines.length / 2) {
          // avoid session timeout
          await closeDriver();
          await startDriver();
        }
        const preReqs = await fetchPreRequisitesByDiscipline(
          department.disciplines[i].url
        );
        if (preReqs != null) {
          this.data[department.code].disciplines[i].requisites = preReqs;
        }
      }
      await closeDriver();
    }
  }
}
