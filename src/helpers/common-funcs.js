export const replaceSymbols = (str) => {
  let strToChange = str;
  const reg = /[^a-zа-яёA-ZА-ЯЁ\d]/g;
  if (str.endsWith('/')) strToChange = str.slice(0, str.length - 1);
  return strToChange.replaceAll(reg, '-');
};

export const createName = (str, ending) => {
  const name = `${replaceSymbols(str)}${ending}`;
  return name;
};
