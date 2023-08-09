import load from './helpers/load.js';
import wf from './helpers/writeFile.js';
import extractFilesAndPrepareHTML from './helpers/html-handler.js';

export default (url, outputPath) => load(url)
  .then((data) => {
    extractFilesAndPrepareHTML(data)
      .then((preparedHTML) => {
        wf(url, outputPath, preparedHTML)
          .then((filePath) => console.log(filePath))
          .catch((e) => console.error(e));
      });
  })
  .catch((e) => console.error(e));
