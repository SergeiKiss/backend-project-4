import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  beforeEach, test, expect, afterAll, jest, describe,
} from '@jest/globals';
import nock from 'nock';
import * as prettier from 'prettier';
import loadPage from '../src/index.js';

// loadPage(url, outputPath)

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

describe('general cases', () => {
  test('page-loader - basic case', async () => {
    const url = new URL('https://ru.hexlet.io/courses');
    nock(url.origin)
      .get(url.pathname)
      .reply(200, rawHTML);

    nock(url.origin)
      .get(url.pathname)
      .reply(200, rawHTML);

    const imgURL = new URL('https://ru.hexlet.io/assets/professions/nodejs.png');
    nock(imgURL.origin)
      .get(imgURL.pathname)
      .reply(200, expectedImage);

    const stylesheetURL = new URL('https://ru.hexlet.io/assets/application.css');
    nock(stylesheetURL.origin)
      .get(stylesheetURL.pathname)
      .reply(200, 'h3 { font-weight: normal; }');

    const scriptURL = new URL('https://ru.hexlet.io/packs/js/runtime.js');
    nock(scriptURL.origin)
      .get(scriptURL.pathname)
      .reply(200, "console.log('Hello, World!')");

    const logSpy = jest.spyOn(console, 'log');

    await loadPage(url.href, currentDir);
    const expectedMainFilePath = `${currentDir}/ru-hexlet-io-courses.html`;
    const actualData = await fs.readFile(expectedMainFilePath, 'utf-8')
      .then(async (html) => {
        const prettierConfig = await prettier.resolveConfig(afterPath);
        return prettier.format(html, { ...prettierConfig, filepath: afterPath });
      });

    expect(actualData).toEqual(expectedHTML);
    expect(logSpy).toHaveBeenCalledWith(`Page was successfully downloaded into '${expectedMainFilePath}'`);

    const expectedFilesDirPath = path.resolve(currentDir, 'ru-hexlet-io-courses_files');
    await fs.opendir(expectedFilesDirPath)
      .catch(() => {
        expect(true).toBeFalsy();
      });

    const imgName = 'ru-hexlet-io-assets-professions-nodejs.png';
    const stylesheetName = 'ru-hexlet-io-assets-application.css';
    const scriptName = 'ru-hexlet-io-packs-js-runtime.js';
    const contentPaths = await fs.readdir(expectedFilesDirPath);
    expect(contentPaths.includes(imgName)).toBeTruthy();
    expect(contentPaths.includes(stylesheetName)).toBeTruthy();
    expect(contentPaths.includes(scriptName)).toBeTruthy();

    const imgPath = path.join(expectedFilesDirPath, imgName);
    const actualImage = await fs.readFile(imgPath);
    expect(actualImage).toEqual(expectedImage);

    const stylesheetPath = path.join(expectedFilesDirPath, stylesheetName);
    const actualStylesheet = await fs.readFile(stylesheetPath, 'utf-8');
    expect(actualStylesheet).toEqual('h3 { font-weight: normal; }');

    const scriptPath = path.join(expectedFilesDirPath, scriptName);
    const actualScript = await fs.readFile(scriptPath, 'utf-8');
    expect(actualScript).toEqual("console.log('Hello, World!')");
  });
});

describe('error cases', () => {
  const url = new URL('https://ru.hexlet.io/courses');

  test('network error - 404', async () => {
    nock(url.origin)
      .get(url.pathname)
      .reply(404);

    await loadPage(url.href, currentDir).catch((e) => {
      expect(e.message).toBe('Request failed with status code 404');
    });
  });

  test('network error - 500', async () => {
    nock(url.origin)
      .get(url.pathname)
      .reply(500);

    await loadPage(url.href, currentDir).catch((e) => {
      expect(e.message).toBe('Request failed with status code 500');
    });
  });

  test('file system error - access is denied', async () => {
    nock(url.origin)
      .get(url.pathname)
      .reply(200, rawHTML);

    nock(url.origin)
      .get(url.pathname)
      .reply(200, rawHTML);

    const imgURL = new URL('https://ru.hexlet.io/assets/professions/nodejs.png');
    nock(imgURL.origin)
      .get(imgURL.pathname)
      .reply(200, expectedImage);

    const stylesheetURL = new URL('https://ru.hexlet.io/assets/application.css');
    nock(stylesheetURL.origin)
      .get(stylesheetURL.pathname)
      .reply(200, 'h3 { font-weight: normal; }');

    const scriptURL = new URL('https://ru.hexlet.io/packs/js/runtime.js');
    nock(scriptURL.origin)
      .get(scriptURL.pathname)
      .reply(200, "console.log('Hello, World!')");

    await fs.chmod(currentDir, 0o400);
    await loadPage(url.href, currentDir)
      .catch((e) => {
        expect(e.message).toMatch(/EACCES/);
      });
  });

  test("file system error - output directory doesn't exist", async () => {
    const badPath = path.join(currentDir, 'unknown');
    await loadPage(url.href, badPath)
      .catch((e) => {
        expect(e.message).toMatch(/ENOENT/);
      });
  });
});

afterAll(() => {
  fs.rm(currentDir, { recursive: true }).catch(noop);
});
