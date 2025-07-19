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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const clearFilters = () => {
    setSearch('');
    setUser('');
    setDate('');
    router.get('/videos');
  };

  return (
    <AuthenticatedLayout
     
    >
      <Head title="Video Management" />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Create Button */}
          <div className={`mb-8 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-end">
              <Link
                href="/videos/create"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-5 h-5 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="relative z-10">Create New Video</span>
              </Link>
            </div>
          </div>

          {/* Search and Filter Form */}
          <div className={`mb-8 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search & Filter
              </h3>
              
              <form onSubmit={handleSearchSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Search Input */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search by title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-all duration-300 placeholder-gray-400"
                        placeholder="Enter video title..."
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-all duration-300"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-end space-x-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-4 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Video List */}
          <div className="space-y-6">
            {videoList.length === 0 ? (
              <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Videos Found</h3>
                  <p className="text-gray-600 text-lg">Try adjusting your search criteria or create a new video.</p>
                </div>
              </div>
            ) : (
              videoList.map((video, index) => (
                <div
                  key={video.id}
                  className={`group transform transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 group-hover:scale-[1.01]">
                    <div className="relative p-8">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Content */}
                      <div className="relative">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          
                          {/* Video Info */}
                          <div className="flex-1 mb-6 lg:mb-0 lg:pr-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-300">
                              {video.title}
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed mb-4">
                              {video.description}
                            </p>
                            
                            {/* Meta Info */}
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                                  <span className="text-emerald-800 font-semibold text-xs">
                                    {(users.find((u) => u.id === video.user_id)?.name || 'Unknown').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-gray-600 font-medium">
                                  {users.find((u) => u.id === video.user_id)?.name || 'Unknown'}
                                </span>
                              </div>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">
                                {formatDate(video.created_at)}
                              </span>
                            </div>
                          </div>

                          {/* Stats and Actions */}
                          <div className="flex flex-col space-y-4">
                            
                            {/* Stats */}
                            <div className="flex items-center justify-center lg:justify-end space-x-6">
                              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-xl">
                                <span className="text-green-600">👍</span>
                                <span className="font-semibold text-green-800">{video.likes_count}</span>
                              </div>
                              <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-xl">
                                <span className="text-red-600">👎</span>
                                <span className="font-semibold text-red-800">{video.dislikes_count}</span>
                              </div>
                              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl">
                                <span className="text-blue-600">👁️</span>
                                <span className="font-semibold text-blue-800">{video.views}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-center lg:justify-end space-x-3">
                              <Link 
                                href={`/watch/${video.slug}`}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                              >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                Watch
                              </Link>

                              {video.user_id === props.auth.user.id && (
                                <Link
                                  href={`/videos/${video.id}/edit`}
                                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                                >
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Load More Button */}
            {currentPage < lastPage && (
              <div className="text-center pt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="group relative inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-transparent rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'xor' }}></div>
                  
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-semibold text-emerald-600">Loading...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors duration-300">
                        Load More Videos
                      </span>
                      <svg className="ml-2 w-5 h-5 text-gray-500 group-hover:text-teal-600 transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}