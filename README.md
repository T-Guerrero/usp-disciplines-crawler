# USP Disciplines Crawler
## About
  Smart crawler that gets all USP disciplines and their prerequisites separated by department.

## Running

❗ | Obs: It's needed an operational system with a GUI
:---: | :---

Having [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/) installed, choose one of the following execution types below.
  
### Single file output
All the results you will be stored as a list of departments in a single file called `data.json` under `/data` directory. This execution type is the most expensive.

Run:
```bash
$> yarn install
$> yarn start singlefile
```

A firefox window will open and the crawler will start, this can take a few hours.

### Multi file output
For each department, a file called `DEP_CODE.json` will be generated under `/data` directory storing all the data from the department with code `DEP_CODE`.  

Run:
```bash
$> yarn install
$> yarn start multifile
```

A firefox window will open and the crawler will start, this can take a few hours.

## Data Structure
The Classes structure is explicit in this UML Class Diagram:

![crawler.jpg](https://github.com/T-Guerrero/usp-disciplines-crawler/blob/main/docs/crawler.jpg?raw=true)
