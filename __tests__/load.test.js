import { test, expect } from '@jest/globals'; // eslint-disable-line
import nock from 'nock'; // eslint-disable-line
import load from '../src/helpers/load.js';

// load(url)

nock.disableNetConnect();

test('load - basic case', async () => {
  const url = new URL('https://ru.hexlet.io/courses');
  nock(url.origin)
    .get(url.pathname)
    .reply(200, 'test data');

  const data = await load(url);
  expect(data).toBe('test data');
});
