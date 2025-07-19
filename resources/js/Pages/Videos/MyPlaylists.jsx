import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { playlists = [] } = usePage().props;
  const [playlistsState, setPlaylistsState] = useState(playlists);
  const [isVisible, setIsVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;
    
    fetch(`/playlists/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
    }).then(() => {
      setPlaylistsState(playlistsState.filter(p => p.id !== id));
    }).catch(error => {
      console.error('Error deleting playlist:', error);
      alert('Failed to delete playlist. Please try again.');
    });
  };

  const startEdit = (id, title) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEdit = (id) => {
    if (!editTitle.trim() || editTitle === playlistsState.find(p => p.id === id)?.title) {
      cancelEdit();
      return;
    }

    fetch(`/playlists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ title: editTitle.trim() }),
    }).then(() => {
      setPlaylistsState(playlistsState.map(p => p.id === id ? { ...p, title: editTitle.trim() } : p));
      cancelEdit();
    }).catch(error => {
      console.error('Error updating playlist:', error);
      alert('Failed to update playlist. Please try again.');
    });
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <AuthenticatedLayout
     
    >
      <Head title="My Playlists" />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-100 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          {/* Create New Playlist Button */}
          <div className={`mb-8 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-end">
              <a
                href="/playlists/create"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-5 h-5 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="relative z-10">Create New Playlist</span>
              </a>
            </div>
          </div>

          {/* Playlists Content */}
          {playlistsState.length === 0 ? (
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="text-center py-20">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-violet-200 to-purple-300 rounded-full mb-6">
                    <svg className="w-12 h-12 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Playlists Yet</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                  You haven't created any playlists yet. Start organizing your favorite videos by creating your first playlist!
                </p>
                <a
                  href="/playlists/create"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your First Playlist
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {playlistsState.map((playlist, index) => (
                <div
                  key={playlist.id}
                  className={`group transform transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 group-hover:scale-105">
                    
                    {/* Playlist Header */}
                    <div className="relative h-32 bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-500 overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                      
                      {/* Playlist Icon */}
                      <div className="absolute bottom-4 left-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Video Count Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                          <span className="text-white text-sm font-semibold">
                            {playlist.videos_count || 0} videos
                          </span>
                        </div>
                      </div>
                      
                      {/* Decorative elements */}
                      <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
                    </div>

                    {/* Playlist Content */}
                    <div className="p-6">
                      {/* Title */}
                      <div className="mb-4">
                        {editingId === playlist.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => handleKeyPress(e, playlist.id)}
                            onBlur={() => saveEdit(playlist.id)}
                            className="w-full text-xl font-bold text-gray-900 bg-transparent border-2 border-violet-300 rounded-lg px-3 py-2 focus:border-violet-500 focus:ring-0 transition-colors duration-300"
                            autoFocus
                          />
                        ) : (
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 transition-all duration-300">
                            {playlist.title}
                          </h3>
                        )}
                      </div>

                      {/* Playlist Info */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                        <span>Created recently</span>
                        <span>{playlist.videos_count || 0} videos</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/playlists/${playlist.id}`}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          View
                        </a>
                        
                        {editingId === playlist.id ? (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => saveEdit(playlist.id)}
                              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                              title="Save"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                              title="Cancel"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(playlist.id, playlist.title)}
                              className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                              title="Edit playlist"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(playlist.id)}
                              className="p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                              title="Delete playlist"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-violet-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-fuchsia-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}