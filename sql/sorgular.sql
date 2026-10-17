-- ====================================================================
-- BVA 2205 Siber Güvenlik ve Bilişim Hukuku - Bireysel Ödev
-- Öğrenci: Hikmet Emre Gültekin | No: 2516016024
-- ====================================================================

-- Görev 3.1: Onay vermiş VE son 30 gün içinde abone olmuş kişileri listeleyin.
SELECT * 
FROM bulten_aboneleri 
WHERE onay = true 
  AND abone_tarihi >= CURRENT_DATE - INTERVAL '30 days';

-- Görev 3.2: En yeni 3 aboneyi e-postası maskelenmiş olarak listeleyin.
SELECT 
  LEFT(eposta, 3) || '***' AS eposta_maskeli,
  ad,
  abone_tarihi
FROM bulten_aboneleri 
ORDER BY abone_tarihi DESC, olusturma DESC 
LIMIT 3;

-- Görev 3.3: Kaynağa göre abone sayısını bulun.
SELECT 
  kaynak, 
  COUNT(*) AS abone_sayisi 
FROM bulten_aboneleri 
GROUP BY kaynak;

-- Görev 3.4: Her ilgi alanı için kaç abone olduğunu kategori adıyla birlikte listeleyin.
-- (Hiç kaydı olmayan kategoriler de 0 ile görünsün)
SELECT 
  i.ad AS kategori_adi, 
  COUNT(b.id) AS abone_sayisi 
FROM ilgi_alanlari i 
LEFT JOIN bulten_aboneleri b ON i.id = b.kategori_id 
GROUP BY i.id, i.ad;

-- Görev 3.5: eposta alanında numaranızın (2516016024) geçtiği kaydı ILIKE ile bulun.
SELECT * 
FROM bulten_aboneleri 
WHERE eposta ILIKE '%2516016024%';

-- Görev 3.6: Tüm e-posta adreslerini küçük harfe çevirin (LOWER).
SELECT 
  id, 
  LOWER(eposta) AS kucuk_harf_eposta, 
  ad 
FROM bulten_aboneleri;

-- Görev 3.7: Onay vermemiş VE 7 günden eski kayıtları silin.
DELETE FROM bulten_aboneleri 
WHERE onay = false 
  AND abone_tarihi < CURRENT_DATE - INTERVAL '7 days';

-- Görev 6 (Güvenlik Ek Sorgusu): Son 24 saatte en çok mesaj gönderen 3 e-posta adresi.
SELECT 
  eposta, 
  COUNT(*) AS mesaj_sayisi 
FROM iletisim_mesajlari 
WHERE gonderim_zamani > now() - interval '24 hours' 
GROUP BY eposta 
ORDER BY mesaj_sayisi DESC 
LIMIT 3;

-- Görev 7 (Hukuk Ek Sorgusu): Veritabanı saat dilimi, sürümü ve toplam mesaj sayısı.
SELECT current_setting('TimeZone') AS saat_dilimi, version() AS surum;
SELECT COUNT(*) AS yurtdisina_aktarilan_mesaj_sayisi FROM iletisim_mesajlari;