/**
 * IndexedDB 캐싱 레이어
 * 금연/흡연구역 및 아파트 데이터를 로컬에 저장하고 관리
 */

import type { AddressItem, ApartmentItem } from "@/types";

const DB_NAME = "cleanbreath-cache";
const DB_VERSION = 1;

// Store 이름 정의
const STORES = {
  ADDRESSES: "addresses",
  APARTMENTS: "apartments",
  METADATA: "metadata",
} as const;

interface MetadataEntry {
  key: string;
  value: string | number;
}

/**
 * IndexedDB 초기화
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // addresses store 생성
      if (!db.objectStoreNames.contains(STORES.ADDRESSES)) {
        db.createObjectStore(STORES.ADDRESSES, { keyPath: "id" });
      }

      // apartments store 생성
      if (!db.objectStoreNames.contains(STORES.APARTMENTS)) {
        db.createObjectStore(STORES.APARTMENTS, { keyPath: "id" });
      }

      // metadata store 생성 (updateAt, lastChecked 등)
      if (!db.objectStoreNames.contains(STORES.METADATA)) {
        db.createObjectStore(STORES.METADATA, { keyPath: "key" });
      }
    };
  });
}

/**
 * 주소 데이터 저장
 */
export async function saveAddresses(
  addresses: AddressItem[],
  updateAt: string,
): Promise<void> {
  const db = await initDB();
  const tx = db.transaction([STORES.ADDRESSES, STORES.METADATA], "readwrite");

  // 기존 데이터 삭제
  const addressStore = tx.objectStore(STORES.ADDRESSES);
  await new Promise<void>((resolve, reject) => {
    const clearRequest = addressStore.clear();
    clearRequest.onsuccess = () => resolve();
    clearRequest.onerror = () => reject(clearRequest.error);
  });

  // 새 데이터 저장
  for (const address of addresses) {
    addressStore.add(address);
  }

  // 메타데이터 저장
  const metadataStore = tx.objectStore(STORES.METADATA);
  metadataStore.put({ key: "addresses_updateAt", value: updateAt });
  metadataStore.put({ key: "addresses_cachedAt", value: Date.now() });

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}

/**
 * 아파트 데이터 저장
 */
export async function saveApartments(
  apartments: ApartmentItem[],
): Promise<void> {
  const db = await initDB();
  const tx = db.transaction([STORES.APARTMENTS, STORES.METADATA], "readwrite");

  // 기존 데이터 삭제
  const apartmentStore = tx.objectStore(STORES.APARTMENTS);
  await new Promise<void>((resolve, reject) => {
    const clearRequest = apartmentStore.clear();
    clearRequest.onsuccess = () => resolve();
    clearRequest.onerror = () => reject(clearRequest.error);
  });

  // 새 데이터 저장
  for (const apartment of apartments) {
    apartmentStore.add(apartment);
  }

  // 메타데이터 저장
  const metadataStore = tx.objectStore(STORES.METADATA);
  metadataStore.put({ key: "apartments_cachedAt", value: Date.now() });

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}

/**
 * 주소 데이터 조회
 */
export async function getAddresses(): Promise<AddressItem[] | null> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORES.ADDRESSES, "readonly");
    const store = tx.objectStore(STORES.ADDRESSES);

    const addresses = await new Promise<AddressItem[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    db.close();
    return addresses.length > 0 ? addresses : null;
  } catch (error) {
    console.error("IndexedDB getAddresses 오류:", error);
    return null;
  }
}

/**
 * 아파트 데이터 조회
 */
export async function getApartments(): Promise<ApartmentItem[] | null> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORES.APARTMENTS, "readonly");
    const store = tx.objectStore(STORES.APARTMENTS);

    const apartments = await new Promise<ApartmentItem[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    db.close();
    return apartments.length > 0 ? apartments : null;
  } catch (error) {
    console.error("IndexedDB getApartments 오류:", error);
    return null;
  }
}

/**
 * 메타데이터 조회
 */
export async function getMetadata(
  key: string,
): Promise<string | number | null> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORES.METADATA, "readonly");
    const store = tx.objectStore(STORES.METADATA);

    const result = await new Promise<MetadataEntry | undefined>(
      (resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      },
    );

    db.close();
    return result?.value ?? null;
  } catch (error) {
    console.error("IndexedDB getMetadata 오류:", error);
    return null;
  }
}

/**
 * 메타데이터 저장
 */
export async function setMetadata(
  key: string,
  value: string | number,
): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(STORES.METADATA, "readwrite");
  const store = tx.objectStore(STORES.METADATA);

  store.put({ key, value });

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}

/**
 * 만료된 데이터 확인 (1개월 이상 된 데이터)
 */
export async function isDataExpired(): Promise<boolean> {
  const cachedAt = await getMetadata("addresses_cachedAt");
  if (!cachedAt || typeof cachedAt !== "number") return true;

  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30일
  return cachedAt < oneMonthAgo;
}

/**
 * 만료된 데이터 삭제
 */
export async function clearExpiredData(): Promise<void> {
  const expired = await isDataExpired();
  if (!expired) return;

  const db = await initDB();
  const tx = db.transaction(
    [STORES.ADDRESSES, STORES.APARTMENTS, STORES.METADATA],
    "readwrite",
  );

  tx.objectStore(STORES.ADDRESSES).clear();
  tx.objectStore(STORES.APARTMENTS).clear();
  tx.objectStore(STORES.METADATA).clear();

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}

/**
 * 모든 데이터 삭제 (디버깅용)
 */
export async function clearAllData(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(
    [STORES.ADDRESSES, STORES.APARTMENTS, STORES.METADATA],
    "readwrite",
  );

  tx.objectStore(STORES.ADDRESSES).clear();
  tx.objectStore(STORES.APARTMENTS).clear();
  tx.objectStore(STORES.METADATA).clear();

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}
