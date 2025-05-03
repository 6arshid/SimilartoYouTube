import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import axios from 'axios';

export default function Dashboard(props) {
  const { videos, users, filters } = props;
  const [search, setSearch] = useState(filters.search || '');
  const [user, setUser] = useState(filters.user || '');
  const [date, setDate] = useState(filters.date || '');
  const [videoList, setVideoList] = useState(videos.data);
  const [currentPage, setCurrentPage] = useState(videos.current_page);
  const [lastPage, setLastPage] = useState(videos.last_page);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setVideoList(videos.data);
    setCurrentPage(videos.current_page);
    setLastPage(videos.last_page);
  }, [videos]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get('/videos', {
      search: search || undefined,
      user: user || undefined,
      date: date || undefined
    });
  };

  const loadMore = () => {
    if (currentPage < lastPage && !loadingMore) {
      setLoadingMore(true);
      axios
        .get(`/videos?page=${currentPage + 1}&search=${search}&user=${user}&date=${date}`)
        .then((response) => {
          const newData = response.data.data;
          setVideoList((prevList) => [...prevList, ...newData]);
          setCurrentPage(response.data.current_page);
          setLastPage(response.data.last_page);
        })
        .finally(() => setLoadingMore(false));
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Video Management
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="p-6">
        {/* Create Button */}
        <div className="mb-4 flex justify-end">
          <Link
            href="/videos/create"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Create New Video
          </Link>
        </div>

        {/* Search and Filter Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-4 flex flex-col md:flex-row md:items-end md:space-x-4"
        >
          <div className="flex-1 mb-2 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by title:
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border-gray-300"
              placeholder="Enter video title..."
            />
          </div>
          
          <div className="mb-2 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="md:mx-2 mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Search
          </button>
        </form>

        {/* Video List */}
        <div className="space-y-4">
          {videoList.map((video) => (
            <div
              key={video.id}
              className="p-4 border rounded flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-800">{video.title}</h2>
                <p className="text-sm text-gray-600">{video.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  By: {users.find((u) => u.id === video.user_id)?.name || 'Unknown'} – Date:{' '}
                  {new Date(video.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 md:mt-0 md:text-center">
                <span className="text-green-600 font-semibold mx-2">👍 {video.likes_count}</span>
                <span className="text-red-600 font-semibold mx-2">👎 {video.dislikes_count}</span>
                <span className="text-gray-600 mx-2">👁️ {video.views}</span>
                <Link href={`/watch/${video.slug}`}>View</Link>

                {video.user_id === props.auth.user.id && (
                  <>
                    <Link
                      href={`/videos/${video.id}/edit`}
                      className="text-yellow-500 hover:underline mx-2"
                    >
                      Edit
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {currentPage < lastPage && (
          <div className="text-center mt-4">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
