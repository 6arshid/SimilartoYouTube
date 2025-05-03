// resources/js/Pages/Profile/Show.jsx
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Profile() {
  const { user, videos } = usePage().props;
  const [sort, setSort] = useState('latest');

  const sortedVideos = [...videos].sort((a, b) => {
    if (sort === 'latest') return new Date(b.created_at) - new Date(a.created_at);
    if (sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sort === 'popular') return b.views - a.views;
    return 0;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">پروفایل {user.name}</h1>

      <div className="mb-4 flex gap-4 items-center">
        <span className="font-semibold">مرتب‌سازی بر اساس:</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded p-1"
        >
          <option value="latest">جدیدترین</option>
          <option value="oldest">قدیمی‌ترین</option>
          <option value="popular">پربازدیدترین</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedVideos.map(video => (
          <a
            key={video.id}
            href={`/watch/${video.slug}`}
            className="border rounded overflow-hidden hover:shadow"
          >
            <img
              src={video.thumbnail ? `/storage/${video.thumbnail}` : '/images/default-thumbnail.jpg'}
              alt={video.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-2">
              <h2 className="font-semibold text-sm text-gray-800 line-clamp-2">{video.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
  توسط <a href={`/profile/${video.user?.id}`} className="text-blue-600 hover:underline">{video.user?.name || 'نامشخص'}</a>
  {' '}در تاریخ {new Date(video.created_at).toLocaleDateString('fa-IR')} –
  <span className="mx-1">👁️ {video.views} بازدید</span>
</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
