import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function PlaylistShow() {
  const { playlist } = usePage().props;

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Playlist: {playlist.title}
        </h2>
      }
    >
      <Head title={`Playlist: ${playlist.title}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {playlist.videos && playlist.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlist.videos.map(video => (
                    <a
                      key={video.id}
                      href={`/watch/${video.slug}`}
                      className="block border rounded hover:shadow"
                    >
                      <img
                        src={
                          video.thumbnail
                            ? `/storage/${video.thumbnail}`
                            : '/images/default-thumbnail.jpg'
                        }
                        alt={video.title}
                        className="w-full h-40 object-cover rounded-t"
                      />
                      <div className="p-2">
                        <h2 className="font-semibold text-sm truncate">{video.title}</h2>
                        <p className="text-xs text-gray-500">
                          By {video.user?.name || 'User'}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">This playlist has no videos.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
