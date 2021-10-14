import 'geckodriver';
import { Builder, withTagName, By } from 'selenium-webdriver';
import Department from './entities/Department.js';
import Discipline from './entities/Discipline.js';
import { RequisitesByCourse, Requisite } from './entities/Requisite.js';

export let driver;

export async function startDriver() {
  driver = await new Builder().forBrowser('firefox').build();
}

export async function closeDriver() {
  await driver.quit();
}

export async function getHrefFrom(element) {
  return await element.getAttribute('href');
}

export async function fetchInstitutesLinks(institutesLink) {
  const institutes = [];
  while (institutes.length == 0) {
    try {
      await driver.get(institutesLink);
      const title = await driver.findElement(By.css('#layout_conteudo table'));
      const table = await driver.findElement(withTagName('table').below(title));
      let rows = await table.findElements(By.css('tr'));

      rows = rows.slice(1, rows.length);

      for (let row of rows) {
        let institute = await row.findElement(By.css('a'));
        institutes.push(await getHrefFrom(institute));
      }
    } catch (e) {
      console.log(
        `Error found in fetchInstitutesLinks! Trying to run again! \n\t Details: ${e}`
      );
    }
  }

  return institutes;
}

export async function fetchDepartmentsByInstitute(instituteLink) {
  const departments = [];
  while (departments.length == 0) {
    try {
      await driver.get(instituteLink);
      await driver
        .findElement(By.linkText('Disciplinas por Departamento'))
        .click();

      const errorMessage = await driver.findElements(By.id('web_mensagem'));
      const hasDepartments = errorMessage.length == 0;

      if (!hasDepartments) return [];

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
    } catch (e) {
      console.log(
        `Error found in fetchDepartmentsByInstitute! Trying to run again! \n\t Details: ${e}`
      );
    }
  }

  return departments;
}

export async function fetchDisciplinesByDepartment(departmentLink) {
  const disciplines = [];
  while (disciplines.length == 0) {
    try {
      await driver.get(departmentLink);

      const errorMessage = await driver.findElements(
        By.className('txt_verdana_10pt_red')
      );
      const hasDisciplines = errorMessage.length == 0;

      if (!hasDisciplines) return [];

      const tables = await driver.findElements(
        By.css('#layout_conteudo table')
      );

      // Is there a filter table in the page?
      let content = tables.length > 3 ? tables[1] : tables[0];

      let rows = await content.findElements(By.css('tr'));
      rows = rows.slice(1, rows.length);

      for (let row of rows) {
        const disciplineElements = await row.findElements(By.css('td'));
        const isDisciplineActive =
          (await disciplineElements[3].findElement(By.css('span')).getText()) ==
          '';

        if (isDisciplineActive) {
          const discipline = await disciplineElements[1].findElement(
            By.css('a')
          );
          const code = await disciplineElements[0]
            .findElement(By.css('span'))
            .getText();
          const name = await discipline.getText();
          const url = await getHrefFrom(discipline);
          disciplines.push(new Discipline(name, code, url));
        }
      }
    } catch (e) {
      console.log(
        `Error found in fetchDisciplinesByDepartment! Trying to run again! \n\t Details: ${e}`
      );
    }
  }

  return disciplines;
}

export async function fetchPreRequisitesByDiscipline(disciplineLink) {
  const requisites = [];
  while (requisites.length == 0) {
    try {
      await driver.get(disciplineLink);

      let errorMessage = await driver.findElements(By.id('web_mensagem'));
      const hasDiscipline = errorMessage.length == 0;

      if (!hasDiscipline) return [];

      let information = await driver.findElement(By.name('form1'));
      const buttons = await information.findElements(By.css('table font a'));
      const preReqsLink = await getHrefFrom(buttons[0]);
      await driver.get(preReqsLink);

      errorMessage = await driver.findElements(By.id('web_mensagem'));
      const hasPreReqs = errorMessage.length == 0;

      if (!hasPreReqs) return [];

      information = await driver.findElement(By.name('form1'));
      information = await information
        .findElement(By.css('table'))
        .findElement(By.css('table:last-child'))
        .findElement(By.css('table'));
      const rows = await information.findElements(By.css('tr'));

      let currentCourse;
      let repeatedCourse = false;
      for (let row of rows) {
        const differentCourse =
          (await row.getAttribute('bgcolor')) == '#658CCF';

        if (differentCourse) {
          const codeRegex = /Curso: (\d{4,5})/;
          const courseName = await row.findElement(By.css('font')).getText();
          const courseCode = courseName.match(codeRegex)[1];

          if (currentCourse && courseCode == currentCourse.courseCode)
            repeatedCourse = true;
          else {
            currentCourse = new RequisitesByCourse(courseCode);
            requisites.push(currentCourse);
            repeatedCourse = false;
          }
        } else if (!repeatedCourse) {
          row = await row.findElements(By.css('td'));
          const text = await row[0].getText();

          if (text == 'ou') {
            // Another set of options for the same course
            currentCourse = new RequisitesByCourse(currentCourse.courseCode);
            requisites.push(currentCourse);
          } else if (text != ' ') {
            const type = await row[1].getText();
            const req = new Requisite(text, type);
            currentCourse.addRequisite(req);
          }
        }
      }
    } catch (e) {
      console.log(
        `Error found in fetchPreRequisitesByDiscipline! Trying to run again! \n\t Details: ${e}`
      );
    }
  }

  return requisites;
}
