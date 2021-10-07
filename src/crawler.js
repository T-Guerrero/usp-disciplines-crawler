import {
  startDriver,
  closeDriver,
  fetchDepartmentsByInstitute,
  fetchDisciplinesByDepartment,
  fetchPreRequisitesByDiscipline,
  fetchInstitutesLinks,
} from './driver.js';
import fs from 'fs';

export default class Crawler {
  constructor() {
    this.data = {};
  }

  async run(initialUrl) {
    try {
      await this.#getDepartments(initialUrl);
      console.log('Departments Fetched!');

      const departments = Object.values(this.data);
      await this.#getDisciplines(departments);
      console.log('Disciplines Fetched!');

      await this.#getPreReqs(departments);
      console.log('PreRequisites Fetched!');
      console.log('Done!');
    } catch (error) {
      console.log('General Error: ' + error);
    }
  }

  saveData(fileName) {
    const converted_data = JSON.stringify(this.data);
    fs.writeFile(fileName, converted_data, (err) => {
      if (err) console.log('Error saving the file: ' + err);
    });
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
