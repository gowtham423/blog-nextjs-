'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/components/AuthProvider';
import { Category } from '@/types';

const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false, loading: () => <div style={{ height: 300, background: '#f3f4f6', borderRadius: 8 }} /> });

function CreateBlogForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState({ title: '', content: '', category_id: '', status: 'published' });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    if (editId) {
      fetch(`/api/blogs/${editId}`).then(r => r.json()).then(d => {
        if (d.blog) {
          setForm({ title: d.blog.title, content: d.blog.content, category_id: d.blog.category_id || '', status: d.blog.status });
          if (d.blog.cover_image) setCoverPreview(d.blog.cover_image);
        }
      });
    }
  }, [editId]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.content || form.content === '<p><br></p>') { setError('Content is required'); return; }
    if (!form.category_id) { setError('Category is required'); return; }

    setSaving(true);
    try {
      let cover_image = coverPreview;
      if (coverFile) {
        setUploading(true);
        cover_image = await uploadFile(coverFile);
        setUploading(false);
      }

      const url = editId ? `/api/blogs/${editId}` : '/api/blogs';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cover_image }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save blog'); return; }
      router.push(`/blog/${data.blog.slug}`);
    } catch {
      setError('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a3c5e', marginBottom: '2rem' }}>
        {editId ? 'Edit Blog' : 'Write a New Blog'}
      </h1>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: '1.5rem', fontSize: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Title <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Enter a compelling blog title..."
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 16, fontWeight: 500, outline: 'none' }} />
        </div>

        {/* Cover Image */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Cover Image <span style={{ color: '#dc2626' }}>*</span>
          </label>
          {coverPreview && (
            <div style={{ marginBottom: 12, borderRadius: 8, overflow: 'hidden', height: 200 }}>
              <img src={coverPreview} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '2px dashed #e5e7eb', borderRadius: 8, cursor: 'pointer', background: '#f9fafb' }}>
            <span style={{ fontSize: 24 }}>📷</span>
            <div>
              <div style={{ fontWeight: 500, color: '#374151', fontSize: 14 }}>
                {coverFile ? coverFile.name : 'Click to upload cover image'}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>PNG, JPG, GIF up to 10MB</div>
            </div>
            <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Category <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}>
            <option value="">Select a category...</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Content <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
            <RichEditor value={form.content} onChange={val => setForm(f => ({ ...f, content: val }))} />
          </div>
        </div>

        {/* Status */}
        {(user?.role === 'admin' || user?.role === 'super_admin') && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              style={{ padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={saving}
            style={{ padding: '12px 32px', background: '#1a3c5e', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {uploading ? 'Uploading...' : saving ? 'Saving...' : editId ? 'Update Blog' : 'Publish Blog'}
          </button>
          <button type="button" onClick={() => router.back()}
            style={{ padding: '12px 24px', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 15, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <CreateBlogForm />
    </Suspense>
  );
}
