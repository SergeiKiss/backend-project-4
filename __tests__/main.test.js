import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { beforeEach, test, expect, afterAll } from '@jest/globals'; // eslint-disable-line
import nock from 'nock'; // eslint-disable-line
import loadPage from '../src/index.js';

// loadPage(url, outputPath)

nock.disableNetConnect();

const noop = () => {};
let currentDir;

beforeEach(async () => {
  await fs.rm(currentDir, { recursive: true }).catch(noop);
  currentDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('page-loader - basic case', async () => {
  const url = new URL('https://ru.hexlet.io/courses');
  nock(url.origin)
    .get(url.pathname)
    .reply(200, 'test data');

  const actualPath = await loadPage(url.href, currentDir);

  const expectedData = 'test data';
  const expectedPath = `${currentDir}/ru-hexlet-io-courses.html`;
  const actualData = await fs.readFile(expectedPath);

  expect(actualData).toEqual(expectedData);
  expect(actualPath).toEqual(expectedPath);
});

afterAll(() => {
  fs.rm(currentDir, { recursive: true }).catch(noop);
});
