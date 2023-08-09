import fs from 'fs/promises';
import path from 'path';
import replaceSymbols from './common-funcs.js';

export default (url, dir, data) => {
  const { hostname, pathname } = new URL(url);
  const fileName = `${replaceSymbols(`${hostname}${pathname}`)}.html`;
  const filePath = path.resolve(dir, fileName);
  return fs.writeFile(filePath, data)
    .then(() => filePath)
    .catch((e) => console.error(e));
};
