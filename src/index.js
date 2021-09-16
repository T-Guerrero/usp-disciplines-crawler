import {
  fetchDepartmentsByUnity,
  fetchUnities,
  getHrefFrom,
} from './actions.js';
import { closeDriver, startDriver } from './driver.js';
import Department from './entity/Department.js';
import fs from 'fs';

function saveDataInJson(data, fileName) {
  const converted_data = JSON.stringify(data);
  fs.writeFile(fileName, converted_data, (err) => {
    if (err) console.log('Error saving the file: ' + err);
  });
}

const crawler = async () => {
  const data = [];
  try {
    const unities_url =
      'https://uspdigital.usp.br/jupiterweb/jupColegiadoLista?tipo=D';
    await startDriver(unities_url);
    const unities = await fetchUnities();
    const unitiesLink = [];

    for (let unity of unities) {
      const link = await getHrefFrom(unity);
      unitiesLink.push(link);
    }

    for (let unity of unitiesLink) {
      const departments = await fetchDepartmentsByUnity(unity);
      if (departments != null)
        for (let department of departments) {
          let element = new Department(
            await department.obj.getText(),
            department.initials
          );
          data.push(element);
        }
    }

    saveDataInJson(data, 'departments.json');

    await closeDriver();
  } catch (error) {
    console.log('Error: ' + error);
  }
};

crawler();
