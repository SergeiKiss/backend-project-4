export const replaceSymbols = (str) => {
  const reg = /[^a-zа-яё\d]/g;
  return str.replaceAll(reg, '-');
};

export const createName = (str, ending) => {
  const name = `${replaceSymbols(str)}${ending}`;
  return name;
};
