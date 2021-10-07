import dotenv from 'dotenv';
import Crawler from './crawler.js';

dotenv.config();

const institutes_url =
  'https://uspdigital.usp.br/jupiterweb/jupColegiadoLista?tipo=D';
const crawler = new Crawler();
await crawler.run(institutes_url);
crawler.saveData('data.json');
