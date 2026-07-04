export function countWords(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function countChars(text) {
  return text ? text.length : 0;
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem('searchHistory') || '[]');
  } catch {
    return [];
  }
}

export function addSearchHistory(term) {
  if (!term || !term.trim()) return;
  const history = getSearchHistory().filter((item) => item !== term.trim());
  history.unshift(term.trim());
  localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10)));
}

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  } catch {
    return [];
  }
}

export function addRecentSearch(term) {
  if (!term || !term.trim()) return;
  const recent = getRecentSearches().filter((item) => item !== term.trim());
  recent.unshift(term.trim());
  localStorage.setItem('recentSearches', JSON.stringify(recent.slice(0, 5)));
}
