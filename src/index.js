import dotenv from 'dotenv';
import Crawler from './crawler.js';

dotenv.config();

const institutes_url =
  'https://uspdigital.usp.br/jupiterweb/jupColegiadoLista?tipo=D';
const crawler = new Crawler(institutes_url);
await crawler.run();
crawler.saveData('data.json');
