import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio'; // eslint-disable-line
import load from './load.js';
import { createName } from './common-funcs.js';

const extractFilesAndPrepareHTML = (url, dirPath, rawHTML) => {
  const { hostname, pathname } = new URL(url);
  const dirFilesName = createName(`${hostname}${pathname}`, '_files');
  const dirFilesPath = path.resolve(dirPath, dirFilesName);
  const $ = cheerio.load(rawHTML);
  return fs.mkdir(dirFilesPath)
    .then(() => {
      const images = $('img');
      for (let i = 0; i < images.length; i += 1) {
        const imgEl = $(images[i]);
        const src = imgEl.attr('src');
        const imgURL = new URL(src, url);
        const { hostname: imgHostname, pathname: imgPathname } = new URL(imgURL);
        const { dir, ext, name } = path.parse(`${imgHostname}${imgPathname}`);
        const imgName = createName(`${dir}/${name}`, ext);
        const imgPath = path.resolve(dirFilesPath, imgName);
        imgEl.attr('src', path.join(dirFilesName, imgName));
        load(imgURL, 'stream')
          .then((data) => {
            fs.writeFile(imgPath, data);
          });
      }
      return $.html();
    });
};
export default extractFilesAndPrepareHTML;
