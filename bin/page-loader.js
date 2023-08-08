#!/usr/bin/env node
import { program } from 'commander'; // eslint-disable-line
import app from '../src/index.js';

program
  .description('Page loader utility')
  .version('1.0.0', '-V, --version', 'output the version number')
  .option('-o, --output [dir]', 'output dir', '/home/user/current-dir')
  .arguments('<url>')
  .action((url, options) => {
    app(url);
    console.log(options);
  });

program.parse();
