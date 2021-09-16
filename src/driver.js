import dotenv from 'dotenv';
import 'chromedriver';
import 'geckodriver';
import { Builder } from 'selenium-webdriver';

dotenv.config();

export let driver;

export async function startDriver(url) {
  driver = await new Builder().forBrowser(process.env.BROWSER).build();
  await driver.get(url);
}

export async function closeDriver() {
  await driver.quit();
}
