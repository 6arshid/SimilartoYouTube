import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function PlaylistShow() {
  const { playlist } = usePage().props;
  const [isVisible, setIsVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playAllVideos = () => {
    if (playlist.videos && playlist.videos.length > 0) {
      window.location.href = `/watch/${playlist.videos[0].slug}?playlist=${playlist.id}`;
    }
  };

  const shufflePlaylist = () => {
    if (playlist.videos && playlist.videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlist.videos.length);
      window.location.href = `/watch/${playlist.videos[randomIndex].slug}?playlist=${playlist.id}&shuffle=1`;
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-600/20"></div>
          <div className="relative px-8 py-16">
            
            {/* Playlist Info */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div className="text-white/80 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    PLAYLIST
                  </div>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {playlist.title}
                </h1>
                
                <div className="flex items-center space-x-6 text-white/80 text-lg">
                  <span>{playlist.videos?.length || 0} videos</span>
                  <span>•</span>
                  <span>Created by You</span>
                  {playlist.videos?.length > 0 && (
                    <>
                      <span>•</span>
                      <span>
                        {Math.floor(playlist.videos.reduce((total, video) => total + (video.duration || 180), 0) / 60)} min total
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              {playlist.videos && playlist.videos.length > 0 && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={playAllVideos}
                    className="group relative inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="w-6 h-6 mr-3 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span className="relative z-10">Play All</span>
                  </button>
                  
                  <button
                    onClick={shufflePlaylist}
                    className="group relative inline-flex items-center px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h5l2 5H9a3.5 3.5 0 000 7h11M20 4l-2 2m2-2l-2-2m2 2h-5l-2 5h2a3.5 3.5 0 010 7H4" />
                    </svg>
                    Shuffle
                  </button>
                </div>
              )}
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-8 right-8 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
      }
    >
      <Head title={`Playlist: ${playlist.title}`} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {playlist.videos && playlist.videos.length > 0 ? (
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              
              {/* Videos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {playlist.videos.map((video, index) => (
                  <div
                    key={video.id}
                    className={`group transform transition-all duration-700 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <a
                      href={`/watch/${video.slug}?playlist=${playlist.id}`}
                      className="block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 group-hover:scale-105"
                    >
                      {/* Video Thumbnail */}
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            video.thumbnail
                              ? `/storage/${video.thumbnail}`
                              : '/images/default-thumbnail.jpg'
                          }
                          alt={video.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = '/images/default-thumbnail.jpg';
                          }}
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Duration Badge */}
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                          {formatDuration(video.duration || 180)}
                        </div>
                        
                        {/* Playlist Position */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2 py-1 rounded-full border border-white/50">
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Video Info */}
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                          {video.title}
                        </h3>
                        
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-indigo-800">
                                {(video.user?.name || 'User').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">{video.user?.name || 'User'}</span>
                          </div>
                        </div>
                        
                        {/* Video Stats */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                              </svg>
                              <span>{video.views || 0}</span>
                            </span>
                            <span>•</span>
                            <span>{formatDuration(video.duration || 180)}</span>
                          </div>
                          
                          <div className="text-xs text-indigo-600 font-semibold group-hover:text-purple-600 transition-colors duration-300">
                            Watch Now →
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="text-center py-20">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Empty Playlist</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                  This playlist doesn't have any videos yet. Start adding videos to build your collection!
                </p>
                <a
                  href="/videos"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Browse Videos
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}