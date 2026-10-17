'use client';

import { useActionState } from 'react';
import { girisYap } from '../actions';
import Link from 'next/link';

export default function GirisPage() {
  const [state, formAction, isPending] = useActionState(girisYap, null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0d14' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '30px', background: '#161b22', borderRadius: '12px', border: '1px solid #30363d', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#58a6ff', margin: '0 0 8px 0' }}>Yönetici Girişi</h2>
          <p style={{ color: '#8b949e', fontSize: '14px', margin: 0 }}>BVA 2205 Portfolyo Yönetim Paneli</p>
        </div>

        {state?.error && (
          <div style={{ background: 'rgba(248, 81, 73, 0.15)', border: '1px solid #f85149', color: '#ff7b72', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
            {state.error}
          </div>
        )}

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#c9d1d9', fontSize: '13px', marginBottom: '6px' }}>E-Posta</label>
            <input 
              type="email" 
              name="eposta" 
              required 
              placeholder="hikmetemre45@gmail.com"
              style={{ width: '100%', padding: '10px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#c9d1d9', fontSize: '13px', marginBottom: '6px' }}>Şifre</label>
            <input 
              type="password" 
              name="sifre" 
              required 
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            style={{ width: '100%', padding: '12px', background: '#238636', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
          >
            {isPending ? 'Doğrulanıyor...' : 'Güvenli Giriş Yap'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ color: '#8b949e', fontSize: '13px', textDecoration: 'none' }}>
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}