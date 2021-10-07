# USP Disciplines Crawler
## About
  Smart crawler that gets all USP disciplines and their prerequisites separated by department.

## Running

❗ | Obs: It's needed an operational system with a GUI
:---: | :---

  Having [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/) installed, run:
```bash
$> yarn install
$> yarn start
```
A firefox window will open and the crawler will start, this can take a few hours. The results you will be generated in `/data` folder.

## Data Structure
  The crawler stores all the data in a file named `data.json`. In that, there is a Hash associating each department code to a Department Class instance. The Classes structure is explicit in this UML Class Diagram:

![crawler.jpg](https://github.com/T-Guerrero/usp-disciplines-crawler/blob/main/docs/crawler.jpg?raw=true)
