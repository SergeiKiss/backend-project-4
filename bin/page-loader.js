#!/usr/bin/env node
import { program } from 'commander';
import app from '../src/index.js';

program
  .description('Page loader utility')
  .version('1.0.0', '-V, --version', 'output the version number')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .arguments('<url>')
  .action((url, options) => {
    const { output } = options;
    app(url, output)
      .then(() => {
        process.exit(0);
      })
      .catch((e) => {
        console.error(e.message);
        process.exit(1);
      });
  });

program.parse();
