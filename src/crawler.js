import fs from 'fs';

export default class Crawler {
  constructor(strategy) {
    this.strategy = strategy;
  }

  async run(initialUrl) {
    try {
      this.strategy.setSaveMethod(this.saveData);
      await this.strategy.run(initialUrl);
      console.log('Done!');
    } catch (error) {
      console.log('General Error: ' + error);
    }
  }

  saveData(data, fileName) {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }
    const converted_data = JSON.stringify(data);
    fs.writeFile(`./data/${fileName}`, converted_data, (err) => {
      if (err) console.log(`Error creating ${fileName}.json: ${err}`);
    });
  }
}
