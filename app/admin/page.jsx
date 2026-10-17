import { oturumKontrol, cikisYap } from '../actions';
import { sql } from '../../lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const oturum = await oturumKontrol();

  // Veritabanı Sayaçları (Görev 4)
  const [{ okunmamis }] = await sql`SELECT COUNT(*)::int AS okunmamis FROM iletisim_mesajlari WHERE okundu = false`;
  const [{ aboneSayisi }] = await sql`SELECT COUNT(*)::int AS aboneSayisi FROM bulten_aboneleri`;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '24px' }}>
      {/* ÜST BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', color: '#58a6ff' }}>Yönetim Paneli</h2>
          <span style={{ fontSize: '13px', color: '#8b949e' }}>Giriş yapan: {oturum.eposta}</span>
        </div>
        <form action={cikisYap}>
          <button type="submit" style={{ background: '#da3633', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Güvenli Çıkış
          </button>
        </form>
      </div>

      {/* İSTATİSTİK KARTLARI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#161b22', padding: '24px', borderRadius: '10px', border: '1px solid #30363d' }}>
          <span style={{ color: '#8b949e', fontSize: '14px' }}>Okunmamış İletişim Mesajları</span>
          <h1 style={{ fontSize: '38px', margin: '12px 0', color: okunmamis > 0 ? '#f0883e' : '#3fb950' }}>{okunmamis}</h1>
          <Link href="/admin/mesajlar" style={{ color: '#58a6ff', fontSize: '14px', textDecoration: 'none' }}>
            Mesajları Oku & Yönet →
          </Link>
        </div>

        <div style={{ background: '#161b22', padding: '24px', borderRadius: '10px', border: '1px solid #30363d' }}>
          <span style={{ color: '#8b949e', fontSize: '14px' }}>Toplam E-Bülten Abonesi</span>
          <h1 style={{ fontSize: '38px', margin: '12px 0', color: '#a371f7' }}>{aboneSayisi}</h1>
          <Link href="/admin/bulten-aboneleri" style={{ color: '#58a6ff', fontSize: '14px', textDecoration: 'none' }}>
            Aboneleri Yönet (CRUD) →
          </Link>
        </div>
      </div>

      <div style={{ padding: '16px', background: 'rgba(56, 139, 253, 0.1)', border: '1px solid #388bfd', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#79c0ff' }}>
          💡 <b>Ödev Durumu:</b> Oturum kontrolü PostgreSQL `oturumlar` tablosu ve HTTP-only çerezle korunmaktadır. 2 saat sonra oturum otomatik sonlanır.
        </p>
      </div>
    </div>
  );
}