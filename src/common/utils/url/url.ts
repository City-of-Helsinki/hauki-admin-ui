export type SearchParameters = { [key: string]: string | string[] };

const parseSearchParameters = (queryStr: string): SearchParameters => {
  const params = new URLSearchParams(queryStr.replace('?', ''));

  return Array.from(params.keys()).reduce<SearchParameters>((acc, key) => {
    const values = params.getAll(key);
    return { ...acc, [key]: values.length > 1 ? values : values[0] };
  }, {});
};

export default { parseSearchParameters };
