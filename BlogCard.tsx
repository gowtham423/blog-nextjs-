import Link from 'next/link';
import { Blog } from '@/types';
import { format } from 'date-fns';

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article style={{
        background: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}>
        {/* Cover Image */}
        <div style={{ height: 200, background: '#1a3c5e', position: 'relative', overflow: 'hidden' }}>
          {blog.cover_image ? (
            <img src={blog.cover_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a3c5e, #2563a8)' }}>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 48 }}>✍</span>
            </div>
          )}
          {blog.category_name && (
            <span style={{ position: 'absolute', top: 12, left: 12, background: '#e85d26', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
              {blog.category_name}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: 17, fontWeight: 700, color: '#1a3c5e', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {blog.title}
          </h2>
          <div style={{ flex: 1, color: '#6b7280', fontSize: 14, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', marginBottom: '1rem' }}>
            {blog.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, background: '#1a3c5e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{blog.author_name.charAt(0).toUpperCase()}</span>
              </div>
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{blog.author_name}</span>
            </div>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              {format(new Date(blog.created_at), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
