import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard() {
  const { playlists = [] } = usePage().props;
  const [playlistsState, setPlaylistsState] = useState(playlists);

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;
    fetch(`/playlists/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
    }).then(() => {
      setPlaylistsState(playlistsState.filter(p => p.id !== id));
    });
  };

  const handleUpdate = (id, title) => {
    const newTitle = prompt('New title:', title);
    if (!newTitle || newTitle === title) return;

    fetch(`/playlists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ title: newTitle }),
    }).then(() => {
      setPlaylistsState(playlistsState.map(p => p.id === id ? { ...p, title: newTitle } : p));
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          My Playlists
        </h2>
      }
    >
      <Head title="My Playlists" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {playlistsState.length === 0 ? (
                <p className="text-gray-500">You haven't created any playlists yet.</p>
              ) : (
                <ul className="space-y-4">
                  {playlistsState.map(p => (
                    <li key={p.id} className="border p-4 rounded flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{p.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`/playlists/${p.id}`}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleUpdate(p.id, p.title)}
                          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
