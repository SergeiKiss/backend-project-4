import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio'; // eslint-disable-line
import load from './load.js';
import { createName } from './common-funcs.js';

const loadFilesAndChangeAttrs = (elements, outputDir, url, $, attrName) => {
  for (let i = 0; i < elements.length; i += 1) {
    const { hostname } = new URL(url);
    const el = $(elements[i]);
    const attr = el.attr(attrName);
    const elURL = new URL(attr, url);
    const { hostname: elHostname, pathname: elPathname } = elURL;
    if (hostname === elHostname) {
      const { dir, ext, name } = path.parse(`${elHostname}${elPathname}`);
      const elName = createName(`${dir}/${name}`, ext || '.html');
      const responseType = ext === '' ? 'json' : 'stream';
      const elPath = path.resolve(outputDir.dirFilesPath, elName);
      el.attr(attrName, path.join(outputDir.dirFilesName, elName));
      load(elURL, responseType)
        .then((data) => {
          if (data === undefined) return;
          fs.writeFile(elPath, data);
        });
    }
  }
};

const extractFilesAndPrepareHTML = (url, outputDirPath, rawHTML) => {
  const { hostname, pathname } = new URL(url);
  const dirFilesName = createName(`${hostname}${pathname}`, '_files');
  const dirFilesPath = path.resolve(outputDirPath, dirFilesName);
  const $ = cheerio.load(rawHTML);
  return fs.mkdir(dirFilesPath)
    .then(() => {
      const images = $('img');
      loadFilesAndChangeAttrs(images, { dirFilesPath, dirFilesName }, url, $, 'src');

      const links = $('link');
      loadFilesAndChangeAttrs(links, { dirFilesPath, dirFilesName }, url, $, 'href');

      const scripts = $('script');
      loadFilesAndChangeAttrs(scripts, { dirFilesPath, dirFilesName }, url, $, 'src');

      return $.html();
    });
};
export default extractFilesAndPrepareHTML;
