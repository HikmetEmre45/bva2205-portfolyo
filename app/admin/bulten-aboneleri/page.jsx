import { oturumKontrol, aboneSil, aboneOnayDegistir, yeniAboneEkle } from '../../actions';
import { sql } from '../../../lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BultenAboneleriPage() {
  await oturumKontrol();

  // Kategori adıyla birlikte aboneleri listeleme (JOIN sorgusu)
  const aboneler = await sql`
    SELECT b.*, i.ad AS kategori_adi 
    FROM bulten_aboneleri b 
    LEFT JOIN ilgi_alanlari i ON b.kategori_id = i.id 
    ORDER BY b.olusturma DESC
  `;

  // Form için ilgi alanları listesi
  const kategoriler = await sql`SELECT * FROM ilgi_alanlari ORDER BY ad ASC`;

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Link href="/admin" style={{ color: '#58a6ff', fontSize: '14px', textDecoration: 'none' }}>
            ← Admin Paneline Dön
          </Link>
          <h2 style={{ margin: '8px 0 0 0', color: '#58a6ff' }}>E-Bülten Aboneleri Yönetimi</h2>
        </div>
      </div>

      {/* YENİ ABONE EKLEME FORMU (INSERT) */}
      <div style={{ background: '#161b22', padding: '20px', borderRadius: '10px', border: '1px solid #30363d', marginBottom: '30px' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#c9d1d9' }}>Yeni Abone Ekle (INSERT)</h4>
        <form action={yeniAboneEkle} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'center' }}>
          <input 
            type="email" 
            name="eposta" 
            required 
            placeholder="E-posta Adresi" 
            style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '6px' }} 
          />
          <input 
            type="text" 
            name="ad" 
            placeholder="Ad Soyad (Opsiyonel)" 
            style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '6px' }} 
          />
          <select 
            name="kategori_id" 
            style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '6px' }}
          >
            {kategoriler.map(k => (
              <option key={k.id} value={k.id}>{k.ad}</option>
            ))}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#8b949e', cursor: 'pointer' }}>
            <input type="checkbox" name="onay" defaultChecked /> Onaylı
          </label>
          <button type="submit" style={{ padding: '9px 16px', background: '#238636', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Abone Ekle
          </button>
        </form>
      </div>

      {/* ABONE LİSTE TABLOSU (SELECT JOIN) */}
      <div style={{ overflowX: 'auto', background: '#161b22', borderRadius: '10px', border: '1px solid #30363d' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #30363d', color: '#8b949e' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>E-Posta</th>
              <th style={{ padding: '12px 16px' }}>Ad</th>
              <th style={{ padding: '12px 16px' }}>İlgi Alanı</th>
              <th style={{ padding: '12px 16px' }}>Kaynak</th>
              <th style={{ padding: '12px 16px' }}>Onay Durumu</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {aboneler.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #21262d' }}>
                <td style={{ padding: '12px 16px', color: '#8b949e' }}>{a.id}</td>
                <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{a.eposta}</td>
                <td style={{ padding: '12px 16px', color: '#c9d1d9' }}>{a.ad || '-'}</td>
                <td style={{ padding: '12px 16px', color: '#58a6ff' }}>{a.kategori_adi || 'Genel'}</td>
                <td style={{ padding: '12px 16px', color: '#8b949e' }}>{a.kaynak || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <form action={aboneOnayDegistir.bind(null, a.id, a.onay)}>
                    <button type="submit" style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', background: a.onay ? 'rgba(46, 160, 67, 0.2)' : 'rgba(248, 81, 73, 0.2)', color: a.onay ? '#3fb950' : '#f85149' }}>
                      {a.onay ? '✓ Onaylı' : '✗ Onaysız'}
                    </button>
                  </form>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <form action={aboneSil.bind(null, a.id)}>
                    <button type="submit" style={{ background: 'transparent', border: '1px solid #da3633', color: '#f85149', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      Sil
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}