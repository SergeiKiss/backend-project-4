import debug from 'debug';
import load from './helpers/load.js';
import wf from './helpers/writeFile.js';
import extractFilesAndPrepareHTML from './helpers/html-handler.js';

const log = debug('page-loader');

export default (url, outputPath) => load(url)
  .then((rawHTML) => extractFilesAndPrepareHTML(url, outputPath, rawHTML)
    .then((preparedHTML) => wf(url, outputPath, preparedHTML)
      .then((filePath) => {
        console.log(filePath);
      })))
  .catch((e) => {
    log(e.message);
    throw new Error(e.message);
  });
