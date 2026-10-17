export const metadata = {
  title: 'Hikmet Emre Gültekin | Portfolio & Admin',
  description: 'Big Data Analytics & Cyber Security Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, padding: 0, background: '#0a0d14', color: '#e6edf3', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}