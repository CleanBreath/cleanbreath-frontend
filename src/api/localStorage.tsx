const DATE_KEY = 'Date';

export const saveDate = (dateString: string): void => {
  try {
    localStorage.setItem(DATE_KEY, dateString);
  } catch (error) {
    console.error("LocalStorage에 날짜 문자열 저장 중 오류 발생:", error);
  }
};

export const getDate = (): string | null => {
  try {
    return localStorage.getItem(DATE_KEY);
  } catch (error) {
    console.error("LocalStorage에서 날짜 문자열 가져오기 오류:", error);
    return null;
  }
};
