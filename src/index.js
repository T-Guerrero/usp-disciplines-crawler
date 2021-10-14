import Crawler from './crawler.js';
import { argv } from 'process';
import SingleFileStrategy from './strategies/singleFileStrategy.js';
import MultiFileStrategy from './strategies/multiFileStrategy.js';

if (argv.length < 3) throw '[ERROR]Invalid number of arguments';

const institutes_url =
  'https://uspdigital.usp.br/jupiterweb/jupColegiadoLista?tipo=D';
const execType = argv[2];
let crawler, strategy;
switch (execType) {
  case 'singlefile':
    strategy = new SingleFileStrategy();
    break;
  case 'multifile':
    strategy = new MultiFileStrategy();
    break;
  default:
    throw '[ERROR]Invalid argument! Valid ones: singlefile, multifile';
}

crawler = new Crawler(strategy);
await crawler.run(institutes_url);
