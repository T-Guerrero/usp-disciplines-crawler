import { withTagName, By } from 'selenium-webdriver';
import { driver } from './driver.js';
import Department from './entities/Department.js';
import Discipline from './entities/Discipline.js';
import { RequisitesByCourse, Requisite } from './entities/Requisite.js';

export async function getHrefFrom(element) {
  return await element.getAttribute('href');
}

export async function fetchInstitutes() {
  const institutes = [];
  const title = await driver.findElement(By.css('#layout_conteudo table'));
  const table = await driver.findElement(withTagName('table').below(title));
  let rows = await table.findElements(By.css('tr'));

  rows = rows.slice(1, rows.length);

  for (let row of rows) {
    let institute = await row.findElement(By.css('a'));
    institutes.push(institute);
  }

  return institutes;
}

export async function fetchDepartmentsByInstitute(instituteLink) {
  const departments = [];
  await driver.get(instituteLink);
  await driver.findElement(By.linkText('Disciplinas por Departamento')).click();

  const errorMessage = await driver.findElements(By.id('web_mensagem'));
  const hasDepartments = errorMessage.length == 0;

  if (!hasDepartments) return null;

  const instituteName = await driver.findElement(By.css('table b'));
  const table = await driver.findElement(
    withTagName('table').below(instituteName)
  );
  let rows = await table.findElements(By.css('tr'));

  rows = rows.slice(1, rows.length);

  for (let row of rows) {
    let [code, department] = await row.findElements(By.css('td'));
    department = await department.findElement(By.css('a'));
    code = await code.findElement(By.css('span'));

    code = await code.getText();
    const name = await department.getText();
    const url = await getHrefFrom(department);

    departments.push(new Department(name, code, url));
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
    // No filter table
    table = tables[0];
  } else {
    table = tables[1];
  }

  let rows = await table.findElements(By.css('tr'));
  rows = rows.slice(1, rows.length);

  for (let row of rows) {
    const elements = await row.findElements(By.css('td'));
    const isDisciplineActive =
      (await elements[3].findElement(By.css('span')).getText()) == '';

    if (isDisciplineActive) {
      const discipline = await elements[1].findElement(By.css('a'));
      const code = await elements[0].findElement(By.css('span')).getText();
      const name = await discipline.getText();
      const url = await getHrefFrom(discipline);
      disciplines.push(new Discipline(name, code, url));
    }
  }

  return disciplines;
}

export async function fetchPreRequisitesByDiscipline(disciplineLink) {
  const requisites = [];
  await driver.get(disciplineLink);

  let information = await driver.findElement(By.name('form1'));
  const buttons = await information.findElements(By.css('table font a'));
  const preReqLink = await getHrefFrom(buttons[0]);
  await driver.get(preReqLink);

  const errorMessage = await driver.findElements(By.id('web_mensagem'));
  const hasPreReqs = errorMessage.length == 0;

  if (!hasPreReqs) return null;

  information = await driver.findElement(By.name('form1'));
  information = await information
    .findElement(By.css('table'))
    .findElement(By.css('table:last-child'))
    .findElement(By.css('table'));
  const rows = await information.findElements(By.css('tr'));

  let currentCourse;
  let duplicatedCourse = false;
  for (let row of rows) {
    const differentCourse = (await row.getAttribute('bgcolor')) == '#658CCF';

    if (differentCourse) {
      const regex = /Curso: (\d{4,5})/;
      const courseName = await row.findElement(By.css('font')).getText();
      const courseCode = courseName.match(regex)[1];

      if (currentCourse && courseCode == currentCourse.courseCode)
        duplicatedCourse = true;
      else {
        duplicatedCourse = false;
        currentCourse = new RequisitesByCourse(courseCode);
        requisites.push(currentCourse);
      }
    } else if (!duplicatedCourse) {
      row = await row.findElements(By.css('td'));
      const preReq = await row[0].getText();

      if (preReq != ' ') {
        const type = await row[1].getText();
        const req = new Requisite(preReq, type);
        currentCourse.addRequisite(req);
      }
    }
  }

  return requisites;
}
