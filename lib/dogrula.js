// Görev 6: Sunucu Tarafı Girdi Doğrulama Fonksiyonları
export function epostaGecerliMi(eposta) {
  if (!eposta || typeof eposta !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(eposta.trim()) && eposta.length <= 150;
}

export function metinUzunlukGecerliMi(metin, min, max) {
  if (!metin || typeof metin !== 'string') return false;
  const len = metin.trim().length;
  return len >= min && len <= max;
}

export function guvenliUrlMi(url) {
  if (!url) return true; // Opsiyonel ise boş geçilebilir
  // XSS engellemek için javascript: veya vbscript: engellenmeli
  return url.startsWith('https://');
}