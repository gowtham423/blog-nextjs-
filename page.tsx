import Link from 'next/link';
import pool from '@/lib/db';
import { formatDate } from '@/lib/utils';

async function getBlogs() {
  const result = await pool.query(
    `SELECT b.id, b.title, b.slug, b.status, b.author_name, b.created_at,
            c.name AS category_name
     FROM blogs b
     LEFT JOIN categories c ON b.category_id = c.id
     ORDER BY b.created_at DESC`
  );
  return result.rows;
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <div className="flex gap-3">
            <Link href="/admin" className="text-sm text-gray-500 hover:underline">
              ← Dashboard
            </Link>
            <Link
              href="/admin/blogs/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              New Post
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog: {
                id: string; title: string; slug: string;
                status: string; author_name: string;
                category_name: string | null; created_at: string;
              }) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                    {blog.title}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {blog.category_name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        blog.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(blog.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="text-indigo-600 hover:underline text-xs mr-3"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {blogs.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">
              No posts yet.{' '}
              <Link href="/admin/blogs/new" className="text-indigo-600 hover:underline">
                Create one
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
