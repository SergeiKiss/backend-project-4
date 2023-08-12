import axios from 'axios'; // eslint-disable-line

export default (url, responseType = 'json') => axios({
  method: 'get',
  url,
  responseType,
}).then((response) => response.data)
  .catch((e) => console.error(e));
