# USP Disciplines Crawler
## About
  Smart crawler that gets all USP disciplines and their prerequisites separated by department.

## Running
  Set up `.env` file by choosing to run either in `chrome` or `firefox`. Don't worry, you don't need to have any of them installed. Just choose the one that you think is going to run best in your computer.
  ```bash
  # only chrome or firefox are suported
  BROWSER=
  ```

  Having [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/) installed, run:
```bash
$> yarn install
$> yarn start
```
Wait!

## Data Structure
  The crawler stores all the data in a file named `data.json`. In that, there is a Hash associating each department code to a Department Class instance. The Classes structure is explicit in this UML Class Diagram:

![crawler.jpg](https://github.com/T-Guerrero/usp-disciplines-crawler/blob/main/docs/crawler.jpg?raw=true)
