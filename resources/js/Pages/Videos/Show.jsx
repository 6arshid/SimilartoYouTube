import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const { video, userLike, isFollowing, auth, comments = [], relatedVideos = [], playlists = [] } = usePage().props;

  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [likeCount, setLikeCount] = useState(video.likes_count);
  const [dislikeCount, setDislikeCount] = useState(video.dislikes_count);
  const [userLikeState, setUserLikeState] = useState(userLike);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [playlistsState, setPlaylistsState] = useState(playlists);
  const [showModal, setShowModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const videoUrl = video.path.startsWith('http') ? video.path : `/storage/${video.path}`;
  const followStatus = typeof isFollowing !== 'undefined' ? isFollowing : false;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleVideoLike = (isLike) => {
    if (!auth?.user) return alert('You must be logged in to vote.');

    axios.post(`/videos/${video.id}/like`, { like: isLike }).then(res => {
      setLikeCount(res.data.likes_count);
      setDislikeCount(res.data.dislikes_count);
      setUserLikeState(res.data.userLike);
    });
  };

  const handleDownload = () => {
    window.open(videoUrl, '_blank');
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Video link copied to clipboard.');
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!auth?.user) return alert('You must be logged in to comment.');
    if (comment.trim() === '') return;

    router.post(`/videos/${video.id}/comments`, {
      body: comment,
      parent_id: replyTo
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setComment('');
        setReplyTo(null);
      }
    });
  };

  const handleCommentLike = (commentId, isLike) => {
    if (!auth?.user) return alert('You must be logged in to vote.');
    router.post(`/comments/${commentId}/like`, { like: isLike }, { preserveScroll: true });
  };

  const handleAddToPlaylist = (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;

    fetch(`/playlists/${selectedPlaylist}/add-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ video_id: video.id }),
    }).then(() => {
      alert('Video added to playlist');
      setSelectedPlaylist('');
    });
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistTitle.trim()) return;

    fetch('/playlists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ title: newPlaylistTitle }),
    })
      .then(res => res.json())
      .then(newPlaylist => {
        setPlaylistsState([...playlistsState, newPlaylist]);
        setNewPlaylistTitle('');
        setShowModal(false);
        alert('Playlist created.');
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <AuthenticatedLayout
     
    >
      <Head title={video.title} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-100 py-8">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            {/* Main Content */}
            <div className="xl:col-span-3">
              
              {/* Video Player */}
              <div className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="bg-black rounded-3xl overflow-hidden shadow-2xl">
                  <video 
                    controls 
                    className="w-full aspect-video" 
                    preload="metadata"
                    poster={video.thumbnail ? `/storage/${video.thumbnail}` : '/images/default-thumbnail.jpg'}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Video Info */}
              <div className={`mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8">
                  
                  {/* Title */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                    {video.title}
                  </h1>

                  {/* Video Meta */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        <span className="font-semibold">{formatViews(video.views)} views</span>
                      </span>
                      <span>•</span>
                      <span>{formatDate(video.created_at)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-gray-100 rounded-full">
                        <button
                          onClick={() => handleVideoLike(true)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-l-full transition-all duration-300 ${
                            userLikeState === 'like' 
                              ? 'bg-green-600 text-white' 
                              : 'hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.629 1.08-1.06 1.533l-.149.15c-.325.325-.72.603-1.158.84a6.118 6.118 0 00-1.478 1.153 3.237 3.237 0 00-.563.954 1.968 1.968 0 00-.233.954c0 .308.035.608.102.897.355 1.553.13 3.14-.675 4.537-.194.335-.498.577-.846.691z"/>
                          </svg>
                          <span className="font-semibold">{likeCount}</span>
                        </button>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <button
                          onClick={() => handleVideoLike(false)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-r-full transition-all duration-300 ${
                            userLikeState === 'dislike' 
                              ? 'bg-red-600 text-white' 
                              : 'hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
                            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.629 1.08-1.06 1.533l-.149.15c-.325.325-.72.603-1.158.84a6.118 6.118 0 00-1.478 1.153 3.237 3.237 0 00-.563.954 1.968 1.968 0 00-.233.954c0 .308.035.608.102.897.355 1.553.13 3.14-.675 4.537-.194.335-.498.577-.846.691z"/>
                          </svg>
                          <span className="font-semibold">{dislikeCount}</span>
                        </button>
                      </div>

                      <button
                        onClick={handleShare}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span className="font-semibold">Share</span>
                      </button>

                      <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-semibold">Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Creator Info */}
                  {video.user && (
                    <div className="flex items-center justify-between p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {video.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <a 
                            href={`/profile/${video.user.id}`} 
                            className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors duration-300"
                          >
                            {video.user.name}
                          </a>
                          <p className="text-sm text-gray-600">Content Creator</p>
                        </div>
                      </div>

                      {auth?.user && video.user_id !== auth.user.id && (
                        <button
                          onClick={() => router.post(`/subscribe/${video.user.id}`)}
                          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                            followStatus 
                              ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                        >
                          {followStatus ? 'Unsubscribe' : 'Subscribe'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {video.description && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowDescription(!showDescription)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors duration-300"
                      >
                        <span>Description</span>
                        <svg 
                          className={`w-5 h-5 transition-transform duration-300 ${showDescription ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showDescription && (
                        <div className="mt-4 p-4 bg-gray-50/80 rounded-xl">
                          <p className="text-gray-700 leading-relaxed">{video.description}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Playlist Actions */}
                  {auth?.user && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        {playlistsState.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <select
                              className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-red-500 focus:ring-0 transition-colors duration-300"
                              onChange={(e) => setSelectedPlaylist(e.target.value)}
                              value={selectedPlaylist}
                            >
                              <option value="">Add to Playlist</option>
                              {playlistsState.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                              ))}
                            </select>
                            <button 
                              onClick={handleAddToPlaylist}
                              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300"
                            >
                              Add
                            </button>
                          </div>
                        )}
                        
                        <button
                          onClick={() => setShowModal(true)}
                          className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:text-red-600 transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Create Playlist</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Comments ({comments.length})
                  </h2>

                  {/* Comment Form */}
                  {auth?.user && (
                    <div className="mb-8">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {auth.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-red-500 focus:ring-0 transition-colors duration-300 resize-none"
                            placeholder={replyTo ? 'Write your reply...' : 'Add a comment...'}
                            rows="3"
                          />
                          {replyTo && (
                            <p className="text-sm text-gray-500 mt-2 mb-2">
                              Replying to comment #{replyTo}
                              <button 
                                onClick={() => setReplyTo(null)}
                                className="ml-2 text-red-600 hover:text-red-700"
                              >
                                Cancel
                              </button>
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-4">
                            <div></div>
                            <button 
                              onClick={handleCommentSubmit}
                              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300 font-semibold"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.map(c => (
                      <div key={c.id} className="group">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {(c.user?.name || 'User').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold text-gray-900">{c.user?.name || 'User'}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">{formatDate(c.created_at)}</span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{c.body}</p>
                            </div>
                            
                            {/* Comment Actions */}
                            <div className="flex items-center space-x-4 mt-3 ml-4">
                              <button 
                                onClick={() => handleCommentLike(c.id, true)} 
                                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors duration-300"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.629 1.08-1.06 1.533l-.149.15c-.325.325-.72.603-1.158.84a6.118 6.118 0 00-1.478 1.153 3.237 3.237 0 00-.563.954 1.968 1.968 0 00-.233.954c0 .308.035.608.102.897.355 1.553.13 3.14-.675 4.537-.194.335-.498.577-.846.691z"/>
                                </svg>
                                <span>{c.likes?.length || 0}</span>
                              </button>
                              <button 
                                onClick={() => handleCommentLike(c.id, false)} 
                                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors duration-300"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
                                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.629 1.08-1.06 1.533l-.149.15c-.325.325-.72.603-1.158.84a6.118 6.118 0 00-1.478 1.153 3.237 3.237 0 00-.563.954 1.968 1.968 0 00-.233.954c0 .308.035.608.102.897.355 1.553.13 3.14-.675 4.537-.194.335-.498.577-.846.691z"/>
                                </svg>
                                <span>{c.dislikes?.length || 0}</span>
                              </button>
                              {auth?.user && (
                                <button 
                                  onClick={() => setReplyTo(c.id)} 
                                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 font-semibold"
                                >
                                  Reply
                                </button>
                              )}
                            </div>

                            {/* Replies */}
                            {c.replies && c.replies.length > 0 && (
                              <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-200 pl-6">
                                {c.replies.map(reply => (
                                  <div key={reply.id} className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-white font-semibold text-xs">
                                        {(reply.user?.name || 'User').charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-semibold text-gray-900 text-sm">{reply.user?.name || 'User'}</span>
                                          <span className="text-xs text-gray-500">•</span>
                                          <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">{reply.body}</p>
                                      </div>
                                      
                                      <div className="flex items-center space-x-3 mt-2 ml-3">
                                        <button 
                                          onClick={() => handleCommentLike(reply.id, true)} 
                                          className="flex items-center space-x-1 text-xs text-gray-600 hover:text-green-600 transition-colors duration-300"
                                        >
                                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.629 1.08-1.06 1.533l-.149.15c-.325.325-.72.603-1.158.84a6.118 6.118 0 00-1.478 1.153 3.237 3.237 0 00-.563.954 1.968 1.968 0 00-.233.954c0 .308.035.608.102.897.355 1.553.13 3.14-.675 4.537-.194.335-.498.577-.846.691z"/>
                                          </svg>
                                          <span>{reply.likes?.length || 0}</span>
                                        </button>
                                        <button 
                                          onClick={() => handleCommentLike(reply.id, false)} 
                                          className="flex items-center space-x-1 text-xs text-gray-600 hover:text-red-600 transition-colors duration-300"
                                        >
                                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
                                            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.629 1.08-1.06 1.533l-.149.15c-.325.325-.72.603-1.158.84a6.118 6.118 0 00-1.478 1.153 3.237 3.237 0 00-.563.954 1.968 1.968 0 00-.233.954c0 .308.035.608.102.897.355 1.553.13 3.14-.675 4.537-.194.335-.498.577-.846.691z"/>
                                          </svg>
                                          <span>{reply.dislikes?.length || 0}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="xl:col-span-1">
              <div className={`sticky top-8 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Related Videos
                  </h3>
                  
                  <div className="space-y-4">
                    {relatedVideos.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-8">No related videos found</p>
                    ) : (
                      relatedVideos.map((v, index) => (
                        <div key={v.id} className="group">
                          <a
                            href={`/watch/${v.slug}`}
                            className="block bg-gray-50/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
                          >
                            <div className="relative">
                              <img
                                src={v.thumbnail ? `/storage/${v.thumbnail}` : '/images/default-thumbnail.jpg'}
                                onError={(e) => { e.target.src = '/images/default-thumbnail.jpg'; }}
                                alt={v.title}
                                className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              
                              {/* Play overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                <div className="w-8 h-8 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-300">
                                  <svg className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>
                              
                              {/* Duration badge */}
                              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                3:24
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <h4 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2 group-hover:text-red-600 transition-colors duration-300 mb-2">
                                {v.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <div className="w-5 h-5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-xs">
                                    {(v.user?.name || 'User').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="font-medium">{v.user?.name || 'User'}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                                <span>{formatViews(v.views || 0)} views</span>
                                <span>•</span>
                                <span>{formatDate(v.created_at)}</span>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Playlist Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create Playlist</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Playlist Title
                  </label>
                  <input
                    type="text"
                    value={newPlaylistTitle}
                    onChange={(e) => setNewPlaylistTitle(e.target.value)}
                    placeholder="Enter playlist title..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-0 transition-colors duration-300"
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePlaylist}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300 font-semibold"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-red-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-red-300/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}