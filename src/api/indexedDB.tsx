import { AddressData } from './types';

const DB_NAME = 'myDatabase';
const STORE_NAME = 'myStore';
const DB_VERSION = 1;

export const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const saveData = (data: AddressData[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    openDb().then((db) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Clear existing data
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => {
        // Add new data after clearing
        const putRequest = store.put({ key: 'data', value: data });
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = (event) => reject((event.target as IDBRequest).error);
      };
      clearRequest.onerror = (event) => reject((event.target as IDBRequest).error);
    }).catch(reject);
  });
};

export const getData = (): Promise<AddressData[]> => {
  return new Promise((resolve, reject) => {
    openDb().then((db) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('data');

      request.onsuccess = () => {
        const result = request.result?.value;
        resolve(result || []);
      };

      request.onerror = (event) => reject((event.target as IDBRequest).error);
    }).catch(reject);
  });
};
