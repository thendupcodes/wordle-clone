export default function useLocalStorage ({
  key
} : {
  key: string
}) {
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.log('Error setting item to local storage: ', err);
    }
  }

  const getItem = () => {
    try {
      const item = JSON.parse(window.localStorage.getItem(key));
      return item != null ? item : undefined;
    } catch (err) {
      console.log('Error getting item from local storage: ', err);
      return null;
    }
  }

  const deleteItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.log('Error deleting item in local storage: ', err);
    }
  }

  return { setItem, getItem, deleteItem };
}