export const replaceAll = (
  str: string,
  replacers: { search: string; replace: string }[]
) => {
  return replacers.reduce(
    (s, { search, replace }) => s.replaceAll(search, replace),
    str
  );
};

export const formatShortString = (
  str: string,
  symbolsCount: number,
  endSymbols?: number
) => {
  if (str.length <= symbolsCount * 2) return str;

  const start = str.substring(0, symbolsCount);
  const end = str.substring(str.length - (endSymbols || symbolsCount));

  return `${start}...${end}`;
};
