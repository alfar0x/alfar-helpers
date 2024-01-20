export const onlyUnique = <T>(value: T, index: number, array: T[]) =>
  array.indexOf(value) === index;

export const sortStrings = (a: string, b: string) => a.localeCompare(b);

export const splitIntoAvgChunks = <T>(arr: T[], maxChunkSize: number) => {
  const res = [];

  const chunks = Math.ceil(arr.length / maxChunkSize);
  const chunkSize = Math.ceil(arr.length / chunks);

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }

  return res;
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
