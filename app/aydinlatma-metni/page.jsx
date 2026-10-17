import Link from 'next/link';

export default function AydinlatmaMetni() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', background: '#161b22', borderRadius: '12px', border: '1px solid #30363d', lineHeight: '1.7', color: '#c9d1d9' }}>
      <h1 style={{ color: '#58a6ff', borderBottom: '1px solid #30363d', paddingBottom: '12px' }}>
        KVKK ve Kişisel Verilerin Yurt Dışına Aktarılması Aydınlatma Metni
      </h1>
      
      <p><b>Veri Sorumlusu:</b> Hikmet Emre Gültekin (Öğrenci No: 2516016024)</p>
      
      <h3 style={{ color: '#f0883e' }}>1. İşlenen Kişisel Veriler ve Amaç</h3>
      <p>
        Bu portfolyo sitesinde yer alan iletişim formu ve e-bülten aboneliği aracılığıyla ad-soyad ve e-posta bilgileriniz toplanmaktadır. Verileriniz yalnızca iletişim taleplerinizi yanıtlamak ve onayınız dahilinde bülten bildirimleri göndermek amacıyla işlenmektedir.
      </p>

      <h3 style={{ color: '#f0883e' }}>2. Verilerin Yurt Dışına Aktarılması (KVKK md. 9)</h3>
      <p>
        Sitemizin altyapısı ve veritabanı bulut bilişim hizmetleri üzerinden sağlanmaktadır. Web barındırma hizmetimiz <b>Vercel Inc.</b>, sunucusuz veritabanı hizmetimiz ise <b>Neon Inc. (Avrupa / Frankfurt - eu-central-1 bölgesi)</b> sunucularında barındırılmaktadır.
      </p>
      <p>
        Bu doğrultuda iletişim formundan ilettiğiniz veriler, 6698 sayılı KVKK’nın 7499 sayılı Kanun ile güncellenen <b>9. maddesi</b> uyarınca yurt dışındaki güvenli sunuculara aktarılmaktadır. İlgili aktarım, veri güvenliğini temin eden teknik ve idari tedbirler kapsamında gerçekleştirilmektedir.
      </p>

      <h3 style={{ color: '#f0883e' }}>3. İlgili Kişi Hakları</h3>
      <p>
        KVKK'nın 11. maddesi kapsamındaki haklarınızı <b>hikmetemre45@gmail.com</b> adresine e-posta göndererek her zaman kullanabilirsiniz.
      </p>

      <div style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #30363d' }}>
        <Link href="/" style={{ color: '#58a6ff', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Portfolyo Ana Sayfasına Dön
        </Link>
      </div>
    </div>
  );
}