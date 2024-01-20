export const replaceAll = (
  str: string,
  replacers: { search: string; replace: string }[]
) => {
  return replacers.reduce(
    (s, { search, replace }) => s.replaceAll(search, replace),
    str
  );
};
