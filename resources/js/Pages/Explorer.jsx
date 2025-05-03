import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Dashboard() {
  const { videos = [], users = [], filters = {} } = usePage().props;
  const { data, setData, get } = useForm({
    search: filters.search || '',
    user: filters.user || '',
    date: filters.date || '',
  });

  const handleFilter = (e) => {
    e.preventDefault();
    get(route('videos.explorer'), { preserveState: true });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Explore All Videos
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <form onSubmit={handleFilter} className="mb-6 flex flex-wrap gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search title..."
              value={data.search}
              onChange={(e) => setData('search', e.target.value)}
              className="px-3 py-2 border rounded w-full sm:w-auto"
            />

            <input
              type="date"
              name="date"
              value={data.date}
              onChange={(e) => setData('date', e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Filter
            </button>
          </form>

          {videos.data && videos.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.data.map(video => (
                <a
                  key={video.id}
                  href={`/watch/${video.slug}`}
                  className="block border rounded overflow-hidden hover:shadow-md"
                >
                  <img
                    src={video.thumbnail ? `/storage/${video.thumbnail}` : '/images/default-thumbnail.jpg'}
                    onError={(e) => (e.target.src = '/images/default-thumbnail.jpg')}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{video.title}</h3>
                    <p className="text-xs text-gray-500">👁️ {video.views} views</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No videos found.</p>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
