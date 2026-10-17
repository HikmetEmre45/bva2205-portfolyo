import { sql } from '../lib/db';
import { bultenAboneOl, mesajGonder } from './actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AnaSayfa() {
  // Görev 5: Sitede yalnızca toplam abone sayısı gösterilir (Kişisel veriler korunur)
  const [{ toplamAbone }] = await sql`SELECT COUNT(*)::int AS toplamAbone FROM bulten_aboneleri`;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* ÜST BAŞLIK */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', color: '#58a6ff' }}>Hikmet Emre Gültekin</h1>
        <p style={{ color: '#8b949e', fontSize: '16px', margin: '0 0 16px 0' }}>
          Manisa Celal Bayar Üniversitesi • Büyük Veri Analistliği (2516016024)
        </p>
        <p style={{ color: '#c9d1d9', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
          BVA 2205 Siber Güvenlik ve Bilişim Hukuku Dersi Kapsamında Geliştirilmiş; Next.js App Router, Neon PostgreSQL ve Güvenli Veritabanı Mimarisi.
        </p>
      </div>

      {/* GÖREV 5 & SİZE ÖZEL MODÜL: E-BÜLTEN ABONELİĞİ */}
      <div style={{ background: '#161b22', padding: '30px', borderRadius: '12px', border: '1px solid #30363d', marginBottom: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#f0883e' }}>📬 E-Bülten Aboneliği</h3>
          <span style={{ background: 'rgba(88, 166, 255, 0.15)', color: '#58a6ff', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            Toplam Abone: {toplamAbone}
          </span>
        </div>
        <p style={{ color: '#8b949e', fontSize: '14px', margin: '0 0 20px 0' }}>
          Büyük veri analitiği ve siber güvenlik yazılarım için abone olabilirsiniz (E-postalar sitede listelenmez).
        </p>

        <form action={bultenAboneOl} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input 
              type="text" 
              name="ad" 
              placeholder="Adınız (Opsiyonel)" 
              style={{ padding: '12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '6px' }} 
            />
            <input 
              type="email" 
              name="eposta" 
              required 
              placeholder="E-posta Adresiniz *" 
              style={{ padding: '12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '6px' }} 
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#c9d1d9', cursor: 'pointer' }}>
            <input type="checkbox" name="onay" required />
            Ticari elektronik ileti almayı ve bülten bildirimlerini kabul ediyorum (6563 s.K.).
          </label>

          <button type="submit" style={{ padding: '12px', background: '#238636', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Bültene Abone Ol
          </button>
        </form>
      </div>

      {/* GÖREV 5 & 6: İLETİŞİM FORMU (HIZ SINIRLI & DOĞRULAMALI) */}
      <div style={{ background: '#161b22', padding: '30px', borderRadius: '12px', border: '1px solid #30363d', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#58a6ff' }}>💬 İletişim Formu</h3>
        <p style={{ color: '#8b949e', fontSize: '13px', margin: '0 0 20px 0' }}>
          (Güvenlik önlemi olarak aynı e-posta ile saatte en fazla 3 mesaj kabul edilmektedir).
        </p>

        <form action={mesajGonder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input 
            type="text" 
            name="ad_soyad" 
            required 
            placeholder="Adınız Soyadınız *" 
            style={{ padding: '12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '6px' }} 
          />
          <input 
            type="email" 
            name="eposta" 
            required 
            placeholder="E-posta Adresiniz *" 
            style={{ padding: '12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '6px' }} 
          />
          <textarea 
            name="mesaj" 
            required 
            rows={4} 
            placeholder="Mesajınız (En az 10 karakter)... *" 
            style={{ padding: '12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '6px', resize: 'vertical' }} 
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#c9d1d9', cursor: 'pointer' }}>
            <input type="checkbox" name="kvkk_onay" required />
            <span>
              <Link href="/aydinlatma-metni" target="_blank" style={{ color: '#58a6ff', textDecoration: 'underline' }}>
                KVKK Aydınlatma Metni'ni
              </Link> ve kişisel verilerimin yurt dışına aktarılmasını onaylıyorum.
            </span>
          </label>

          <button type="submit" style={{ padding: '12px', background: '#1f6feb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Mesajı Gönder
          </button>
        </form>
      </div>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #30363d', fontSize: '13px', color: '#8b949e' }}>
        <p>© 2026 Hikmet Emre Gültekin | Manisa Celal Bayar Üniversitesi</p>
        <p>
          <Link href="/giris" style={{ color: '#58a6ff', textDecoration: 'none' }}>
            🔒 Yönetici Girişi
          </Link>
          {' • '}
          <Link href="/aydinlatma-metni" style={{ color: '#8b949e', textDecoration: 'none' }}>
            Aydınlatma Metni (KVKK md. 9)
          </Link>
        </p>
      </footer>
    </div>
  );
}