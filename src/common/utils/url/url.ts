import querystring from 'querystring';

export type SearchParameters = { [key: string]: string | string[] };

const parseSearchParameters = (queryStr: string): SearchParameters => {
  const parsed = querystring.parse(queryStr.replace('?', ''));

  return Object.fromEntries(
    Object.entries(parsed).filter(([, value]) => value !== undefined)
  ) as SearchParameters;
};

export default { parseSearchParameters };
