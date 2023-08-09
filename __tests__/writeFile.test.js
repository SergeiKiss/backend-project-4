import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { beforeEach, test, expect, afterAll } from '@jest/globals'; // eslint-disable-line
import wf from '../src/writeFile.js';

// wf(url, dir, data)

const noop = () => {};
let currentDir;

beforeEach(async () => {
  await fs.rm(currentDir, { recursive: true }).catch(noop);
  currentDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('writeFile - basic case', async () => {
  const expectedData = 'test data';
  const url = 'https://ru.hexlet.io/courses';
  const actualPath = await wf(url, currentDir, expectedData);

  const expectedPath = `${currentDir}/ru-hexlet-io-courses.html`;
  const actualData = await fs.readFile(expectedPath);

  expect(actualData).toEqual(expectedData);
  expect(actualPath).toEqual(expectedPath);
});

afterAll(() => {
  fs.rm(currentDir, { recursive: true }).catch(noop);
});
