const storeItem = <T>({
  key,
  value,
}: {
  key: string;
  value: T;
}): T | undefined => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return undefined;
  }
};

const getItem = <T>(key: string): T | undefined => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return undefined;
  }
};

const removeItem = (key: string): void => window.localStorage.removeItem(key);

export default {
  storeItem,
  getItem,
  removeItem,
};
