'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setMenuOpen(false);
  };

  return (
    <nav style={{ background: '#1a3c5e', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#e85d26', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>S</span>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>She Software</div>
            <div style={{ color: '#93c5fd', fontSize: 11, lineHeight: 1.3 }}>Solutions Blog</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none', padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>
            Home
          </Link>
          {user && (
            <Link href="/create" style={{ color: '#cbd5e1', textDecoration: 'none', padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>
              Write Blog
            </Link>
          )}
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <Link href="/admin" style={{ color: '#cbd5e1', textDecoration: 'none', padding: '8px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>
              Admin
            </Link>
          )}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
              <div style={{ background: '#2563a8', borderRadius: 20, padding: '6px 14px', color: 'white', fontSize: 13 }}>
                {user.name}
              </div>
              <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
              <Link href="/login" style={{ color: '#cbd5e1', textDecoration: 'none', padding: '8px 14px', borderRadius: 6, fontSize: 14, border: '1px solid #475569' }}>
                Login
              </Link>
              <Link href="/register" style={{ background: '#e85d26', color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 600 }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
