import {
  fetchDepartmentsByInstitute,
  fetchDisciplinesByDepartment,
  fetchPreRequisitesByDiscipline,
  fetchInstitutes,
  getHrefFrom,
} from './actions.js';
import { startDriver, closeDriver } from './driver.js';
import fs from 'fs';

export default class Crawler {
  constructor(initialUrl) {
    this.url = initialUrl;
    this.data = {};
  }

  async run() {
    try {
      await startDriver(this.url);
      let institutes = await fetchInstitutes();
      institutes = await this.#processInstitutes(institutes);

      institutes = [institutes[1]];
      for (let institute of institutes) {
        const departments = await fetchDepartmentsByInstitute(institute);
        this.#processDepartments(departments);
      }

      console.log('Departments Fetched!');

      const departments = Object.values(this.data);
      for (let department of departments) {
        const disciplines = await fetchDisciplinesByDepartment(department.url);
        this.#processDisciplines(department, disciplines);
      }

      console.log('Disciplines Fetched!');

      for (let department of departments) {
        for (let i in department.disciplines) {
          const preReqs = await fetchPreRequisitesByDiscipline(
            department.disciplines[i].url
          );
          this.#processPreReqs(department, i, preReqs);
        }
      }

      console.log('PreRequisites Fetched!');

      await closeDriver();

      console.log('Done!');
    } catch (error) {
      console.log('Error: ' + error);
    }
  }

  saveData(fileName) {
    const converted_data = JSON.stringify(this.data);
    fs.writeFile(fileName, converted_data, (err) => {
      if (err) console.log('Error saving the file: ' + err);
    });
  }

  async #processInstitutes(institutes) {
    for (let i in institutes) {
      institutes[i] = await getHrefFrom(institutes[i]);
    }
    return institutes;
  }

  #processDepartments(departments) {
    if (departments != null) {
      for (let department of departments)
        this.data[department.code] = department;
    }
  }

  #processDisciplines(department, disciplines) {
    if (disciplines != null) {
      this.data[department.code].disciplines = disciplines;
    }
  }

  #processPreReqs(department, disciplineIndex, preReqs) {
    if (preReqs != null) {
      this.data[department.code].disciplines[disciplineIndex].requisites =
        preReqs;
    }
  }
}
