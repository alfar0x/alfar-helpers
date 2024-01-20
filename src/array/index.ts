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

export const zip = <T>(...arrays: T[][]) => {
  if (arrays.some((a) => a.length !== arrays[0].length)) {
    throw new Error(`Length must be equal`);
  }

  return arrays[0].map((_, i) => arrays.map((a) => a[i]));
};
