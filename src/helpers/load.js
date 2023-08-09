import axios from 'axios'; // eslint-disable-line

export default (url) => axios
  .get(url)
  .then((response) => response.data)
  .catch((e) => console.error(e));
