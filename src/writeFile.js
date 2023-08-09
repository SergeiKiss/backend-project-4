import fs from 'fs/promises';
import path from 'path';

const replaceSymbols = (str) => {
  const reg = /[^a-zа-яё\d]/g;
  return str.replaceAll(reg, '-');
};

export default (url, dir, data) => {
  const { hostname, pathname } = new URL(url);
  const fileName = `${replaceSymbols(`${hostname}${pathname}`)}.html`;
  const filePath = path.resolve(dir, fileName);
  return fs.writeFile(filePath, data)
    .then(() => filePath)
    .catch((e) => console.error(e));
};
