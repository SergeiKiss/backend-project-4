import load from './load.js';
import wf from './writeFile.js';

export default (url, outputPath) => load(url)
  .then((data) => {
    wf(url, outputPath, data)
      .then((filePath) => console.log(filePath))
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));
