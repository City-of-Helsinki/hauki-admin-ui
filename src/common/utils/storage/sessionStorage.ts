const storeItem = <T>({
  key,
  value,
}: {
  key: string;
  value: T;
}): T | undefined => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
     
    console.log(error);
    return undefined;
  }
};

const getItem = <T>(key: string): T | undefined => {
  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
     
    console.log(error);
    return undefined;
  }
};

const removeItem = (key: string): void => window.sessionStorage.removeItem(key);

export default {
  storeItem,
  getItem,
  removeItem,
};
