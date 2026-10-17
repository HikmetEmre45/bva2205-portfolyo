import { oturumKontrol, mesajOkunduYap, mesajSil } from '../../actions';
import { sql } from '../../../lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MesajlarPage() {
  await oturumKontrol();

  // Mesajları yeniden eskiye sıralama
  const mesajlar = await sql`
    SELECT * FROM iletisim_mesajlari 
    ORDER BY gonderim_zamani DESC
  `;

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin" style={{ color: '#58a6ff', fontSize: '14px', textDecoration: 'none' }}>
          ← Admin Paneline Dön
        </Link>
        <h2 style={{ margin: '8px 0 0 0', color: '#58a6ff' }}>Gelen İletişim Mesajları</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mesajlar.length === 0 ? (
          <div style={{ background: '#161b22', padding: '24px', borderRadius: '8px', textAlign: 'center', color: '#8b949e' }}>
            Henüz hiç mesaj gönderilmemiş.
          </div>
        ) : (
          mesajlar.map(m => (
            <div key={m.id} style={{ background: '#161b22', borderRadius: '10px', border: `1px solid ${m.okundu ? '#30363d' : '#388bfd'}`, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#fff' }}>
                    {m.ad_soyad} {!m.okundu && <span style={{ background: '#1f6feb', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px' }}>YENİ</span>}
                  </h4>
                  <a href={`mailto:${m.eposta}`} style={{ color: '#58a6ff', fontSize: '13px', textDecoration: 'none' }}>
                    {m.eposta}
                  </a>
                </div>
                <span style={{ fontSize: '12px', color: '#8b949e' }}>
                  {new Date(m.gonderim_zamani).toLocaleString('tr-TR')}
                </span>
              </div>

              <div style={{ background: '#0d1117', padding: '14px', borderRadius: '6px', color: '#c9d1d9', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                {m.mesaj}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                {!m.okundu && (
                  <form action={mesajOkunduYap.bind(null, m.id)}>
                    <button type="submit" style={{ background: '#238636', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      Okundu İşaretle
                    </button>
                  </form>
                )}
                <form action={mesajSil.bind(null, m.id)}>
                  <button type="submit" style={{ background: 'transparent', border: '1px solid #da3633', color: '#f85149', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    Sil
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}