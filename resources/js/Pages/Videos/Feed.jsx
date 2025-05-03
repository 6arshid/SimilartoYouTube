// resources/js/Pages/Videos/Feed.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Feed() {
  const { videos } = usePage().props;
  const [videoList, setVideoList] = useState(videos.data);
  const [currentPage, setCurrentPage] = useState(videos.current_page);
  const [lastPage, setLastPage] = useState(videos.last_page);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (currentPage >= lastPage || loading) return;
    setLoading(true);

    axios.get(`/feed?page=${currentPage + 1}`).then((res) => {
      setVideoList([...videoList, ...res.data.data]);
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    }).finally(() => setLoading(false));
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Followed Videos
        </h2>
      }
    >
      <Head title="Followed Videos" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {videoList.length === 0 ? (
            <p className="text-gray-600">There are no videos from followed users.</p>
          ) : (
            <div className="space-y-4">
              {videoList.map(video => (
                <div key={video.id} className="p-4 border rounded bg-white shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800">{video.title}</h2>
                  <p className="text-sm text-gray-600">{video.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    By: {video.user?.name || 'User'} - {new Date(video.created_at).toLocaleDateString('en-US')}
                  </p>
                  <a href={`/watch/${video.slug}`} className="text-blue-500 hover:underline mt-2 inline-block">
                    ▶️ Watch Video
                  </a>
                </div>
              ))}

              {currentPage < lastPage && (
                <div className="text-center mt-4">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
