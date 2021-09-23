import { withTagName, By } from 'selenium-webdriver';
import { driver } from './driver.js';

export async function getHrefFrom(element) {
  return await element.getAttribute('href');
}

export async function fetchUnities() {
  const unities = [];
  const title = await driver.findElement(By.css('#layout_conteudo table'));
  const table = await driver.findElement(withTagName('table').below(title));
  let rows = await table.findElements(By.css('tr'));

  rows = rows.slice(1, rows.length);

  for (let row of rows) {
    let unity = await row.findElement(By.css('a'));
    unities.push(unity);
  }

  return unities;
}

export async function fetchDepartmentsByUnity(unityLink) {
  const departments = [];
  await driver.get(unityLink);
  await driver.findElement(By.linkText('Disciplinas por Departamento')).click();

  const errorMessage = await driver.findElements(By.id('web_mensagem'));
  const hasDepartments = errorMessage.length == 0;

  if (!hasDepartments) return null;

  const unityName = await driver.findElement(By.css('table b'));
  const table = await driver.findElement(withTagName('table').below(unityName));
  let rows = await table.findElements(By.css('tr'));

  rows = rows.slice(1, rows.length);

  for (let row of rows) {
    const [initials, department] = await row.findElements(By.css('td'));
    departments.push({
      initials: await initials.findElement(By.css('span')).getText(),
      obj: await department.findElement(By.css('a')),
    });
  }

  return departments;
}

export async function fetchDisciplinesByDepartment(departmentLink) {
  const disciplines = [];
  await driver.get(departmentLink);
  const errorMessage = await driver.findElements(
    By.className('txt_verdana_10pt_red')
  );
  const hasDisciplines = errorMessage.length == 0;

  if (!hasDisciplines) return null;

  const tables = await driver.findElements(By.css('#layout_conteudo table'));
  let table;
  if (tables.length != 4) {
    // No filter
    table = tables[0];
  } else {
    table = tables[1];
  }

  let rows = await table.findElements(By.css('tr'));
  rows = rows.slice(1, rows.length);

  for (let row of rows) {
    const elements = await row.findElements(By.css('td'));
    const isDisciplineAlive =
      (await elements[3].findElement(By.css('span')).getText()) == '';

    if (isDisciplineAlive)
      disciplines.push({
        initials: await elements[0].findElement(By.css('span')).getText(),
        obj: await elements[1].findElement(By.css('a')),
      });
  }

  return disciplines;
}
