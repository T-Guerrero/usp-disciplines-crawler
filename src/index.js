import Crawler from './crawler.js';
import { argv } from 'process';
import singleFileStrategy from './strategies/singleFileStrategy.js';

if (argv.length < 3) throw '[ERROR]Invalid number of arguments';

const institutes_url =
  'https://uspdigital.usp.br/jupiterweb/jupColegiadoLista?tipo=D';
const execType = argv[2];
let crawler, strategy;
switch (execType) {
  case 'singlefile':
    strategy = new singleFileStrategy();
    crawler = new Crawler(strategy);
    break;
  default:
    throw '[ERROR]Invalid argument! Valid ones: singlefile';
}

await crawler.run(institutes_url);
