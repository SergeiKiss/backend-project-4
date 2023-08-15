import fs from 'fs/promises';
import path from 'path';
import debug from 'debug';
import { createName } from './common-funcs.js';

const log = debug('page-loader');

export default (url, dir, data) => {
  log('Start writing to main html file');
  const { hostname, pathname } = new URL(url);
  const fileName = createName(`${hostname}${pathname}`, '.html');
  const filePath = path.resolve(dir, fileName);
  return fs.writeFile(filePath, data)
    .then(() => {
      log('Finish writing to main html file');
      return filePath;
    })
    .catch((e) => log(e.message));
};
