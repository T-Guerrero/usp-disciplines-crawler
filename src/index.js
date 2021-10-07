import Crawler from './crawler.js';

const institutes_url =
  'https://uspdigital.usp.br/jupiterweb/jupColegiadoLista?tipo=D';
const crawler = new Crawler();
await crawler.run(institutes_url);
crawler.saveData('data.json');
