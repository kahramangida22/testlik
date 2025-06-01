
export function detectLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  const htmlLang = lang.startsWith('tr') ? 'tr' : 'en';
  document.documentElement.lang = htmlLang;
}
