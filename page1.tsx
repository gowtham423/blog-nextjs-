'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Blog } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import { format } from 'date-fns';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(r => r.json())
      .then(d => { setBlog(d.blog); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!confirm('Delete this blog?')) return;
    setDeleting(true);
    await fetch(`/api/blogs/${blog!.id}`, { method: 'DELETE' });
    router.push('/');
  };

  if (loading) return (
    <div style={{ maxWidth: 800, margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center', color: '#6b7280' }}>
      Loading...
    </div>
  );

  if (!blog) return (
    <div style={{ maxWidth: 800, margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <h2 style={{ color: '#1a3c5e' }}>Blog not found</h2>
      <Link href="/" style={{ color: '#2563a8' }}>← Back to home</Link>
    </div>
  );

  const canEdit = user && (user.id === blog.author_id || user.role === 'admin' || user.role === 'super_admin');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem', fontSize: 14, color: '#6b7280' }}>
        <Link href="/" style={{ color: '#2563a8', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        {blog.category_name && <><span style={{ color: '#e85d26' }}>{blog.category_name}</span><span>›</span></>}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{blog.title}</span>
      </div>

      {/* Cover Image */}
      {blog.cover_image && (
        <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: '2rem', height: 400 }}>
          <img src={blog.cover_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        {blog.category_name && (
          <span style={{ background: '#e85d26', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            {blog.category_name}
          </span>
        )}
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#1a3c5e', margin: '1rem 0', lineHeight: 1.3 }}>
          {blog.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: '#1a3c5e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700 }}>{blog.author_name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 15 }}>{blog.author_name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{format(new Date(blog.created_at), 'MMMM d, yyyy')}</div>
            </div>
          </div>
          {canEdit && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href={`/create?edit=${blog.id}`} style={{ padding: '8px 16px', background: '#1a3c5e', color: 'white', borderRadius: 6, textDecoration: 'none', fontSize: 13 }}>
                Edit
              </Link>
              <button onClick={handleDelete} disabled={deleting}
                style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '2rem' }} />

      {/* Content */}
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} 
        style={{ fontSize: 16, lineHeight: 1.8, color: '#1a1a2e' }} />

      {/* Media */}
      {blog.media && blog.media.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fb', borderRadius: 12 }}>
          <h3 style={{ color: '#1a3c5e', marginBottom: '1rem' }}>Media Files</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {blog.media.map(m => (
              <div key={m.id} style={{ borderRadius: 8, overflow: 'hidden' }}>
                {m.file_type?.startsWith('image') ? (
                  <img src={m.file_url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                ) : (
                  <a href={m.file_url} style={{ display: 'block', padding: '1rem', background: 'white', borderRadius: 8, textDecoration: 'none', color: '#2563a8', fontSize: 14 }}>
                    📎 View File
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
        <Link href="/" style={{ color: '#2563a8', textDecoration: 'none', fontWeight: 500 }}>← Back to all blogs</Link>
      </div>
    </div>
  );
}
