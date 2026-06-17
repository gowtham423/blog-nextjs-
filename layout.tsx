import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'She Software Solutions Blog',
  description: 'Knowledge sharing and SEO blog platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </main>
          <footer style={{ background: '#1a3c5e', color: '#94a3b8', padding: '2rem 1.5rem', textAlign: 'center', marginTop: 'auto' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ fontWeight: 700, color: 'white', marginBottom: 4 }}>She Software Solutions</div>
              <div style={{ fontSize: 13 }}>© {new Date().getFullYear()} · blogs.shesoftwaresolutions.com</div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
