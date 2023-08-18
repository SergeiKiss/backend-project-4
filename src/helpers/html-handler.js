import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import debug from 'debug';
import Listr from 'listr';
import load from './load.js';
import { createName } from './common-funcs.js';

const log = debug('page-loader');

const createTasksToLoadAssets = (elements, outputDir, url, $, attrName) => {
  const tasks = [];
  for (let i = 0; i < elements.length; i += 1) {
    const { hostname } = new URL(url);
    const el = $(elements[i]);
    const attr = el.attr(attrName);
    log(`Link handling - ${attr}`);
    const elURL = new URL(attr, url);
    const { hostname: elHostname, pathname: elPathname } = elURL;
    if (hostname === elHostname) {
      log('Data can be loaded');
      const { dir, ext, name } = path.parse(`${elHostname}${elPathname}`);
      const elName = createName(`${dir}/${name}`, ext || '.html');
      const responseType = ext === '' ? 'json' : 'stream';
      const elPath = path.resolve(outputDir.dirFilesPath, elName);
      el.attr(attrName, path.join(outputDir.dirFilesName, elName));
      tasks.push({
        title: elURL.href,
        task: () => load(elURL, responseType)
          .then((data) => {
            if (data === undefined) {
              log('Data could not be written to file');
              throw new Error('Data could not be written to file');
            }
            log('Start writing data to a file');
            fs.writeFile(elPath, data);
          }),
      });
    } else log("Data cant't be loaded");
  }
  return tasks;
};

const extractFilesAndPrepareHTML = (url, outputDirPath, rawHTML) => {
  const { hostname, pathname } = new URL(url);
  const dirFilesName = createName(`${hostname}${pathname}`, '_files');
  const dirFilesPath = path.resolve(outputDirPath, dirFilesName);
  const $ = cheerio.load(rawHTML);

  log(`Creating a directory for assets (path: ${dirFilesPath})`);
  return fs.mkdir(dirFilesPath)
    .then(() => {
      log('Uploading images');
      const images = $('img');
      const imgTasks = createTasksToLoadAssets(images, { dirFilesPath, dirFilesName }, url, $, 'src');

      log('Uploading assets from link elements');
      const links = $('link');
      const linksTasks = createTasksToLoadAssets(links, { dirFilesPath, dirFilesName }, url, $, 'href');

      log('Uploading scripts');
      const scripts = $('script');
      const scriptsTasks = createTasksToLoadAssets(scripts, { dirFilesPath, dirFilesName }, url, $, 'src');

      new Listr(
        [...imgTasks, ...linksTasks, ...scriptsTasks],
        { concurrent: true, exitOnError: false },
      )
        .run()
        .catch((err) => console.error(err));
      return $.html();
    });
};
export default extractFilesAndPrepareHTML;
