### Hexlet tests, my tests, CodeClimate tests - maintainability and test coverage:
[![Actions Status](https://github.com/SergeiKiss/backend-project-4/workflows/hexlet-check/badge.svg)](https://github.com/SergeiKiss/backend-project-4/actions)
[![Node CI](https://github.com/SergeiKiss/backend-project-4/actions/workflows/nodejs.yml/badge.svg)](https://github.com/SergeiKiss/backend-project-4/actions/workflows/nodejs.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/c73eb658a988d062c6f8/maintainability)](https://codeclimate.com/github/SergeiKiss/backend-project-4/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c73eb658a988d062c6f8/test_coverage)](https://codeclimate.com/github/SergeiKiss/backend-project-4/test_coverage)

# PageLoader

**Project description**<br>
My project PageLoader is a command line utility that downloads pages from the internet and saves them to your computer. Together with the page, it downloads all the resources (pictures, styles and js) making it possible to open the page without the Internet. The utility downloads resources in parallel and shows the progress for each resource in the terminal

**Stack**: JavaScript, DOM(cheerio), AJAX(axios), jest and nock (testing), commander, listr

## Setup
```bash
make install
npm link
```
Note: *npm link* may require *sudo*

#### Run this before use
```bash
page-loader -h
```

## Examples

https://asciinema.org/a/601418 - load and save <br>
https://asciinema.org/a/602137 - load with images <br>
https://asciinema.org/a/602203 - load with images, links and scripts <br>
https://asciinema.org/a/602692 - logging <br>
https://asciinema.org/a/603155 - errors handling <br>
https://asciinema.org/a/603355 - final result