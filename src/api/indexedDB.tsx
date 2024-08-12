import { AddressData, ApartmentData } from './types';

const DB_NAME = 'myDatabase';
const DB_VERSION = 2;
const ADDRESS_STORE = 'addressStore';
const APARTMENTS_STORE = 'apartmentsStore';

export const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      Array.from(db.objectStoreNames).forEach((storeName) => {
        db.deleteObjectStore(storeName);
      });

      if (!db.objectStoreNames.contains(ADDRESS_STORE)) {
        db.createObjectStore(ADDRESS_STORE, { keyPath: 'key' });
      }

      if (!db.objectStoreNames.contains(APARTMENTS_STORE)) {
        db.createObjectStore(APARTMENTS_STORE, { keyPath: 'key' });
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
    openDb()
      .then((db) => {
        const transaction = db.transaction(ADDRESS_STORE, 'readwrite');
        const store = transaction.objectStore(ADDRESS_STORE);

        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          const putRequest = store.put({ key: 'data', value: data });
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = (event) => reject((event.target as IDBRequest).error);
        };
        clearRequest.onerror = (event) => reject((event.target as IDBRequest).error);
      })
      .catch((error) => reject(error));
  });
};

export const saveApartmentsData = (data: ApartmentData[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    openDb()
      .then((db) => {
        const transaction = db.transaction(APARTMENTS_STORE, 'readwrite');
        const store = transaction.objectStore(APARTMENTS_STORE);

        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          const putRequest = store.put({ key: 'apartmentsdata', value: data });
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = (event) => reject((event.target as IDBRequest).error);
        };
        clearRequest.onerror = (event) => reject((event.target as IDBRequest).error);
      })
      .catch((error) => reject(error));
  });
};

export const getData = (): Promise<AddressData[]> => {
  return new Promise((resolve, reject) => {
    openDb()
      .then((db) => {
        const transaction = db.transaction(ADDRESS_STORE, 'readonly');
        const store = transaction.objectStore(ADDRESS_STORE);
        const request = store.get('data');

        request.onsuccess = () => {
          const result = request.result?.value;
          resolve(result || []);
        };

        request.onerror = (event) => reject((event.target as IDBRequest).error);
      })
      .catch((error) => reject(error));
  });
};

export const getApartmentsData = (): Promise<ApartmentData[]> => {
  return new Promise((resolve, reject) => {
    openDb()
      .then((db) => {
        const transaction = db.transaction(APARTMENTS_STORE, 'readonly');
        const store = transaction.objectStore(APARTMENTS_STORE);
        const request = store.get('apartmentsdata');

        request.onsuccess = () => {
          const result = request.result?.value;
          resolve(result || []);
        };

        request.onerror = (event) => reject((event.target as IDBRequest).error);
      })
      .catch((error) => reject(error));
  });
};
