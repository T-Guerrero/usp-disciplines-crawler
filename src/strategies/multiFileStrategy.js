import {
  startDriver,
  closeDriver,
  fetchDepartmentsByInstitute,
  fetchDisciplinesByDepartment,
  fetchPreRequisitesByDiscipline,
  fetchInstitutesLinks,
} from '../driver.js';

export default class MultiFileStrategy {
  constructor() {
    this.departments = [];
    this.saveMethod = undefined;
  }

  async setSaveMethod(method) {
    this.saveMethod = method;
  }

  async run(initialUrl) {
    await this.#getDepartments(initialUrl);
    console.log('Departments Fetched!');

    for (let i in this.departments) {
      await startDriver();
      const department = this.departments[i];
      const disciplines = await fetchDisciplinesByDepartment(department.url);
      department.disciplines = disciplines;

      if (disciplines.length > 0) {
        await this.#getPreReqsByDepartment(department);
        this.saveMethod(department, department.code);
      }

      console.log(`Finish ${department.code}-${department.name}!`);

      // Free memory
      this.departments[i] = null;
      await closeDriver();
    }
  }

  async #getDepartments(url) {
    await startDriver();
    const institutes = await fetchInstitutesLinks(url);

    for (let link of institutes) {
      const departments = await fetchDepartmentsByInstitute(link);
      this.departments = this.departments.concat(departments);
    }
    await closeDriver();
  }

  async #getPreReqsByDepartment(department) {
    for (let j in department.disciplines) {
      const preReqs = await fetchPreRequisitesByDiscipline(
        department.disciplines[j].url
      );
      department.disciplines[j].requisites = preReqs;
    }
  }
}
