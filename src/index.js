import {
  fetchDepartmentsByUnity,
  fetchDisciplinesByDepartment,
  fetchPreRequisitesByDiscipline,
  fetchUnities,
  getHrefFrom,
} from './actions.js';
import { closeDriver, startDriver } from './driver.js';
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

    console.log('Unities Fetched!');

    for (let unity of unities) {
      const departments = await fetchDepartmentsByUnity(unity);
      if (departments != null)
        for (let department of departments) data[department.code] = department;
    }

    console.log('Departments Fetched!');

    const departments = Object.values(data);
    for (let department of departments) {
      const disciplines = await fetchDisciplinesByDepartment(department.url);
      if (disciplines != null) {
        department.disciplines = disciplines;
      }
    }

    console.log('Disciplines Fetched!');

    for (let department of departments) {
      for (let discipline of department.disciplines) {
        const preReq = await fetchPreRequisitesByDiscipline(discipline.url);
        if (preReq != null) {
          discipline.requisites = preReq;
        }
      }
    }

    console.log('PreRequisites Fetched!');

    saveDataInJson(data, 'data.json');

    console.log('Done!');
    await closeDriver();
  } catch (error) {
    console.log('Error: ' + error);
  }
};

crawler();
