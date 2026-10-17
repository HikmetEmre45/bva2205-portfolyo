'use server';

import { sql } from '../lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { epostaGecerliMi, metinUzunlukGecerliMi } from '../lib/dogrula';
import { revalidatePath } from 'next/cache';

// ====================================================================
// 1. OTURUM VE GİRİŞ İŞLEMLERİ (Görev 4)
// ====================================================================

export async function girisYap(prevState, formData) {
  const eposta = formData.get('eposta')?.toString().trim();
  const sifre = formData.get('sifre')?.toString();

  if (!eposta || !sifre) {
    return { error: 'E-posta veya şifre hatalı' };
  }

  // Yöneticiyi veritabanından çek (Parametreli güvenli sorgu)
  const yoneticiler = await sql`SELECT * FROM yoneticiler WHERE eposta = ${eposta}`;
  if (yoneticiler.length === 0) {
    return { error: 'E-posta veya şifre hatalı' };
  }

  const yonetici = yoneticiler[0];
  const sifreDogru = await bcrypt.compare(sifre, yonetici.sifre_hash);

  if (!sifreDogru) {
    return { error: 'E-posta veya şifre hatalı' };
  }

  // 2 saat geçerli rastgele token üret
  const token = crypto.randomBytes(32).toString('hex');
  const bitis = new Date(Date.now() + 2 * 60 * 60 * 1000);

  // Oturumu veritabanına kaydet
  await sql`
    INSERT INTO oturumlar (token, yonetici_id, bitis)
    VALUES (${token}, ${yonetici.id}, ${bitis})
  `;

  // httpOnly güvenli çerez yaz
  const cookieStore = await cookies();
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: bitis,
    path: '/',
  });

  redirect('/admin');
}

export async function cikisYap() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (token) {
    await sql`DELETE FROM oturumlar WHERE token = ${token}`;
    cookieStore.delete('admin_token');
  }

  redirect('/giris');
}

export async function oturumKontrol() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect('/giris');
  }

  const oturumlar = await sql`
    SELECT o.*, y.eposta 
    FROM oturumlar o 
    JOIN yoneticiler y ON o.yonetici_id = y.id 
    WHERE o.token = ${token} AND o.bitis > now()
  `;

  if (oturumlar.length === 0) {
    redirect('/giris');
  }

  return oturumlar[0];
}

// ====================================================================
// 2. BÜLTEN ABONELİĞİ İŞLEMLERİ (Görev 5 & Size Özel Modül)
// ====================================================================

export async function bultenAboneOl(prevState, formData) {
  const eposta = formData.get('eposta')?.toString().trim().toLowerCase();
  const ad = formData.get('ad')?.toString().trim();
  const onay = formData.get('onay') === 'on';

  if (!epostaGecerliMi(eposta)) {
    return { error: 'Lütfen geçerli bir e-posta adresi giriniz.' };
  }

  // ON CONFLICT DO NOTHING: Aynı e-posta tekrar gelirse hata vermez
  await sql`
    INSERT INTO bulten_aboneleri (eposta, ad, onay, kaynak, kategori_id)
    VALUES (${eposta}, ${ad || null}, ${onay}, 'Portfolyo Web', 1)
    ON CONFLICT (eposta) DO NOTHING
  `;

  revalidatePath('/');
  return { success: 'Bültene başarıyla abone oldunuz!' };
}

// ====================================================================
// 3. İLETİŞİM FORMU & HIZ SINIRI (Görev 5 & 6)
// ====================================================================

export async function mesajGonder(prevState, formData) {
  const ad_soyad = formData.get('ad_soyad')?.toString().trim();
  const eposta = formData.get('eposta')?.toString().trim().toLowerCase();
  const mesaj = formData.get('mesaj')?.toString().trim();
  const kvkk_onay = formData.get('kvkk_onay') === 'on';

  // 1. Sunucu Tarafı Doğrulamalar (Görev 6)
  if (!kvkk_onay) {
    return { error: 'Lütfen KVKK Aydınlatma Metni onay kutusunu işaretleyiniz.' };
  }

  if (!metinUzunlukGecerliMi(ad_soyad, 2, 100)) {
    return { error: 'Ad Soyad 2 ile 100 karakter arasında olmalıdır.' };
  }

  if (!epostaGecerliMi(eposta)) {
    return { error: 'Geçerli bir e-posta adresi giriniz.' };
  }

  if (!metinUzunlukGecerliMi(mesaj, 10, 2000)) {
    return { error: 'Mesajınız en az 10, en fazla 2000 karakter olmalıdır.' };
  }

  // 2. Hız Sınırı (Rate Limit): Aynı e-postadan saatte en fazla 3 mesaj (Görev 6)
  const [{ sayi }] = await sql`
    SELECT COUNT(*)::int AS sayi FROM iletisim_mesajlari
    WHERE eposta = ${eposta} AND gonderim_zamani > now() - interval '1 hour'
  `;

  if (sayi >= 3) {
    return { error: 'Hız sınırı aşıldı: Aynı e-posta adresiyle 1 saat içinde en fazla 3 mesaj gönderebilirsiniz.' };
  }

  // 3. Veritabanına Kaydet
  await sql`
    INSERT INTO iletisim_mesajlari (ad_soyad, eposta, mesaj, kvkk_onay)
    VALUES (${ad_soyad}, ${eposta}, ${mesaj}, true)
  `;

  revalidatePath('/');
  return { success: 'Mesajınız başarıyla iletildi!' };
}

// ====================================================================
// 4. ADMİN PANELİ CRUD İŞLEMLERİ (Görev 4)
// ====================================================================

export async function aboneSil(id) {
  await oturumKontrol();
  await sql`DELETE FROM bulten_aboneleri WHERE id = ${id}`;
  revalidatePath('/admin/bulten-aboneleri');
}

export async function aboneOnayDegistir(id, simdikiOnay) {
  await oturumKontrol();
  await sql`UPDATE bulten_aboneleri SET onay = ${!simdikiOnay} WHERE id = ${id}`;
  revalidatePath('/admin/bulten-aboneleri');
}

export async function yeniAboneEkle(formData) {
  await oturumKontrol();
  const eposta = formData.get('eposta')?.toString().trim().toLowerCase();
  const ad = formData.get('ad')?.toString().trim();
  const kategori_id = parseInt(formData.get('kategori_id') || '1');
  const onay = formData.get('onay') === 'on';

  if (!epostaGecerliMi(eposta)) return;

  await sql`
    INSERT INTO bulten_aboneleri (eposta, ad, onay, kaynak, kategori_id)
    VALUES (${eposta}, ${ad || null}, ${onay}, 'Admin Paneli', ${kategori_id})
    ON CONFLICT (eposta) DO UPDATE SET ad = EXCLUDED.ad, onay = EXCLUDED.onay
  `;
  revalidatePath('/admin/bulten-aboneleri');
}

export async function mesajOkunduYap(id) {
  await oturumKontrol();
  await sql`UPDATE iletisim_mesajlari SET okundu = true WHERE id = ${id}`;
  revalidatePath('/admin/mesajlar');
}

export async function mesajSil(id) {
  await oturumKontrol();
  await sql`DELETE FROM iletisim_mesajlari WHERE id = ${id}`;
  revalidatePath('/admin/mesajlar');
}