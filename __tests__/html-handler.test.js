import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { beforeEach, test, expect, afterAll } from '@jest/globals'; // eslint-disable-line
import nock from 'nock'; // eslint-disable-line
import * as prettier from 'prettier'; // eslint-disable-line
import extractFilesAndPrepareHTML from '../src/helpers/html-handler.js';

// extractFilesAndPrepareHTML(url, dirPath, rawHTML)

nock.disableNetConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '.', '__fixtures__', filename);

const noop = () => {};
const beforePath = getFixturePath('before.html');
const afterPath = getFixturePath('after.html');
const imagePath = getFixturePath('nodejs.png');
const expectedImage = await fs.readFile(imagePath);
let currentDir;
let rawHTML;
let expectedHTML;

beforeEach(async () => {
  await fs.rm(currentDir, { recursive: true }).catch(noop);
  currentDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  rawHTML = await fs.readFile(beforePath, 'utf-8');
  expectedHTML = await fs.readFile(afterPath, 'utf-8')
    .then(async (html) => {
      const prettierConfig = await prettier.resolveConfig(afterPath);
      return prettier.format(html, { ...prettierConfig, filepath: afterPath });
    });
});

test('extractFilesAndPrepareHTML - basic case', async () => {
  const url = 'https://ru.hexlet.io/courses';
  const imgURL = new URL('https://ru.hexlet.io/assets/professions/nodejs.png');
  nock(imgURL.origin)
    .get(imgURL.pathname)
    .reply(200, expectedImage);

  const preparedHTML = await extractFilesAndPrepareHTML(url, currentDir, rawHTML)
    .then(async (html) => {
      const prettierConfig = await prettier.resolveConfig(afterPath);
      return prettier.format(html, { ...prettierConfig, filepath: afterPath });
    });
  expect(preparedHTML).toEqual(expectedHTML);

  const expectedFilesDirPath = path.resolve(currentDir, 'ru-hexlet-io-courses_files');
  await fs.opendir(expectedFilesDirPath)
    .catch(() => {
      expect(true).toBeFalsy();
    });

  const imgName = 'ru-hexlet-io-assets-professions-nodejs.png';
  const contentPaths = await fs.readdir(expectedFilesDirPath);
  expect(contentPaths.includes(imgName)).toBeTruthy();

  const imgPath = path.join(expectedFilesDirPath, imgName);
  const actualImage = await fs.readFile(imgPath);
  expect(expectedImage).toEqual(actualImage);
});

afterAll(() => {
  fs.rm(currentDir, { recursive: true }).catch(noop);
});
