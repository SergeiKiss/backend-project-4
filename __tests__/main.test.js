import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { beforeEach, test, expect, afterAll, jest } from '@jest/globals'; // eslint-disable-line
import nock from 'nock'; // eslint-disable-line
import loadPage from '../src/index.js';

// loadPage(url, outputPath)

nock.disableNetConnect();

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

test('page-loader - basic case', async () => {
  const url = new URL('https://ru.hexlet.io/courses');
  nock(url.origin)
    .get(url.pathname)
    .reply(200, rawHTML);

  const logSpy = jest.spyOn(console, 'log');

  await loadPage(url.href, currentDir);

  const expectedMainFilePath = `${currentDir}/ru-hexlet-io-courses.html`;
  const actualData = await fs.readFile(expectedMainFilePath, { encoding: 'utf8' });

  expect(actualData).toEqual(expectedHTML);
  expect(logSpy).toHaveBeenCalledWith(expectedMainFilePath);

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
