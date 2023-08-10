import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { beforeEach, test, expect, afterAll } from '@jest/globals'; // eslint-disable-line
import extractFilesAndPrepareHTML from '../src/helpers/html-handler.js';

// extractFilesAndPrepareHTML(url, dir, rawHTML)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '.', '__fixtures__', filename);

const noop = () => {};
const beforePath = getFixturePath('before.html');
const afterPath = getFixturePath('after.html');
let currentDir;
let rawHTML;
let expectedHTML;

beforeEach(async () => {
  await fs.rm(currentDir, { recursive: true }).catch(noop);
  currentDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  rawHTML = await fs.readFile(beforePath, 'utf-8');
  expectedHTML = await fs.readFile(afterPath, 'utf-8');
});

test('extractFilesAndPrepareHTML - basic case', async () => {
  const url = 'https://ru.hexlet.io/courses';
  const preparedHTML = await extractFilesAndPrepareHTML(url, currentDir, rawHTML);
  expect(preparedHTML).toEqual(expectedHTML);

  const expectedFilesDirPath = path.resolve(currentDir, 'ru-hexlet-io-courses_files');
  await fs.opendir(expectedFilesDirPath)
    .catch(() => {
      expect(true).toBeFalsy();
    });

  const contentPaths = await fs.readdir(expectedFilesDirPath);
  expect(contentPaths.includes('ru-hexlet-io-assets-professions-nodejs.png')).toBeTruthy();
});

afterAll(() => {
  fs.rm(currentDir, { recursive: true }).catch(noop);
});
