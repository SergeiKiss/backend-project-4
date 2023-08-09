import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { beforeEach, test, expect, afterAll } from '@jest/globals'; // eslint-disable-line
import wf from '../src/helpers/writeFile.js';

// wf(url, dir, data)

const noop = () => {};
const expectedData = 'test data';
let currentDir;

beforeEach(async () => {
  await fs.rm(currentDir, { recursive: true }).catch(noop);
  currentDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('writeFile - basic case', async () => {
  const url = 'https://ru.hexlet.io/courses';
  const actualPath = await wf(url, currentDir, expectedData);
  const expectedPath = `${currentDir}/ru-hexlet-io-courses.html`;
  expect(actualPath).toEqual(expectedPath);

  const actualData = await fs.readFile(expectedPath, 'utf-8');
  expect(actualData).toEqual(expectedData);
});

test('writeFile - case with numbers in url', async () => {
  const url = 'https://ru.hexlet.io/123456';
  const actualPath = await wf(url, currentDir, expectedData);
  const expectedPath = `${currentDir}/ru-hexlet-io-123456.html`;
  expect(actualPath).toEqual(expectedPath);

  const actualData = await fs.readFile(expectedPath, 'utf-8');
  expect(actualData).toEqual(expectedData);
});

afterAll(() => {
  fs.rm(currentDir, { recursive: true }).catch(noop);
});
