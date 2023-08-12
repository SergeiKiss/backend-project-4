import axios from 'axios'; // eslint-disable-line

export default (url, responseType = 'json') => axios({
  method: 'get',
  url,
  responseType,
}).then((response) => response.data)
  .catch((e) => console.error(e));

// export default (url, responseType = 'json') => {
//   const funcsByResponseType = {
//     json: axios
//       .get(url)
//       .then((response) => response.data),

//     stream: axios({
//       method: 'get',
//       url,
//       responseType,
//     }).then((response) => response.data),
//   }
// response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
//   return
//   .catch((e) => console.error(e));
// };
