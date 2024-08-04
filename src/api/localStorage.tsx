const COUNT_KEY = 'dataCount';

export const saveCount = (count: number): void => {
  localStorage.setItem(COUNT_KEY, count.toString());
};

export const getCount = (): number | null => {
  try {
    const count = localStorage.getItem(COUNT_KEY);
    return count !== null ? parseInt(count, 10) : null;
  } catch (error) {
    console.error("LocalStorage 카운트 가져오기 오류:", error);
    return null;
  }
};
