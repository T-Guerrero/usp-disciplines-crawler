import {
  fetchDepartmentsByUnity,
  fetchDisciplinesByDepartment,
  fetchUnities,
  getHrefFrom,
} from './actions.js';
import { closeDriver, startDriver } from './driver.js';
import Department from './entity/Department.js';
import Discipline from './entity/Discipline.js';
import fs from 'fs';

function saveDataInJson(data, fileName) {
  const converted_data = JSON.stringify(data);
  fs.writeFile(fileName, converted_data, (err) => {
    if (err) console.log('Error saving the file: ' + err);
  });
}

const crawler = async () => {
  const data = {};

  try {
    const unities_url =
      'https://uspdigital.usp.br/jupiterweb/jupColegiadoLista?tipo=D';
    await startDriver(unities_url);
    let unities = await fetchUnities();
    for (let i in unities) {
      unities[i] = await getHrefFrom(unities[i]);
    }

    for (let unity of unities) {
      const departments = await fetchDepartmentsByUnity(unity);
      if (departments != null) {
        for (let department of departments) {
          const name = await department.obj.getText();
          const url = await getHrefFrom(department.obj);
          const initials = department.initials;
          department = new Department(name, initials, url);
          data[initials] = department;
        }
      }
    }

    const departments = Object.values(data);
    for (let department of departments) {
      const disciplines = await fetchDisciplinesByDepartment(department.url);
      if (disciplines != null)
        for (let discipline of disciplines) {
          const name = await discipline.obj.getText();
          const url = await getHrefFrom(discipline.obj);
          const initials = discipline.initials;
          discipline = new Discipline(name, initials, url);
          department.addDiscipline(discipline);
        }
    }

    if (!process.env.TEST) saveDataInJson(data, 'data.json');

    await closeDriver();
  } catch (error) {
    console.log('Error: ' + error);
  }
};

crawler();
