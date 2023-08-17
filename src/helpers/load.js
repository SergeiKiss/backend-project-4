import axios from 'axios';
import 'axios-debug-log'; // Why doesn't it work?
import debug from 'debug';

const log = debug('page-loader');

export default (url, responseType = 'json') => {
  log(`Start loading - ${url}`);
  return axios({
    method: 'get',
    url,
    responseType,
  }).then((response) => {
    log(`Received response from ${response.config.url} with status ${response.status}`);
    return response.data;
  })
    .catch((e) => {
      log(e.message);
      throw new Error(e.message);
    });
};
