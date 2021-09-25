import Crawler from './crawler.js';

const institutes_url =
  'https://uspdigital.usp.br/jupiterweb/jupColegiadoLista?tipo=D';
const crawler = new Crawler(institutes_url);
await crawler.run();
crawler.saveData('data.json');
