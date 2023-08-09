export default (str) => {
  const reg = /[^a-zа-яё\d]/g;
  return str.replaceAll(reg, '-');
};
