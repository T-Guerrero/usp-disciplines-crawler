import { withTagName, By } from 'selenium-webdriver';
import { closeDriver, startDriver, driver } from './driver.js';
import Unity from './entity/Unity.js';

async function fetchUnities() {
  const title = await driver.findElement(By.css('#layout_conteudo table'));
  const table = await driver.findElement(withTagName('table').below(title));
  let rows = await table.findElements(By.css('tr'));

  rows = rows.slice(1, rows.length);

  for (let row of rows) {
    let unityName = await row.findElement(By.css('a')).getText();
    let unity = new Unity(unityName);
    console.log(unity);
  }
}

const crawler = async () => {
  try {
    let unities_url =
      'https://uspdigital.usp.br/jupiterweb/jupColegiadoLista?tipo=D';
    await startDriver(unities_url);
    await fetchUnities();
    await closeDriver();
  } catch (error) {
    console.log('Error: ' + error);
  }
};

crawler();
