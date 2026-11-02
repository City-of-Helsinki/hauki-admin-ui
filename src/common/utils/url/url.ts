export type SearchParameters = { [key: string]: string | string[] };

const parseSearchParameters = (queryStr: string): SearchParameters => {
  const params = new URLSearchParams(queryStr.replace('?', ''));
  const grouped = new Map<string, string[]>();

  params.forEach((value, key) => {
    const values = grouped.get(key);
    if (values) {
      values.push(value);
    } else {
      grouped.set(key, [value]);
    }
  });

  return Object.fromEntries(
    Array.from(grouped, ([key, values]) => [
      key,
      values.length > 1 ? values : values[0],
    ])
  ) as SearchParameters;
};

export default { parseSearchParameters };
