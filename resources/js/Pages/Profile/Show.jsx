import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Head, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function Profile() {
  const { auth, user: initialUser, videos, isFollowing } = usePage().props;
  const isOwner = auth?.user?.id === initialUser.id;
  const [user, setUser] = useState(initialUser);
  const [sort, setSort] = useState('latest');
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [coverSrc, setCoverSrc] = useState(null);
  const [avatarCrop, setAvatarCrop] = useState(null);
  const [coverCrop, setCoverCrop] = useState(null);
  const [mode, setMode] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const { post, setData, delete: destroy } = useForm();
  const followStatus = typeof isFollowing !== 'undefined' ? isFollowing : false;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const onAvatarFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setMode('avatar');
      const reader = new FileReader();
      reader.addEventListener('load', () => setAvatarSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const processImage = async (imageRef, crop, targetWidth, targetHeight) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    const image = imageRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], 'image.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.9);
    });
  };

  const handleAvatarUpload = async () => {
    if (avatarRef.current && avatarCrop?.width && avatarCrop?.height) {
      const file = await processImage(avatarRef, avatarCrop, 400, 400);
      setData('avatar', file);
      post(route('profile.update.avatar'), {
        onSuccess: () => {
          setAvatarSrc(null);
          setAvatarCrop(null);
          setMode(null);
          window.location.reload();
        }
      });
    }
  };

  const handleCoverUpload = async () => {
    if (coverRef.current && coverCrop?.width && coverCrop?.height) {
      const file = await processImage(coverRef, coverCrop, 851, 315);
      setData('cover', file);
      post(route('profile.update.cover'), {
        onSuccess: () => {
          setCoverSrc(null);
          setCoverCrop(null);
          setMode(null);
          window.location.reload();
        }
      });
    }
  };

  const onCoverFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setMode('cover');
      const reader = new FileReader();
      reader.addEventListener('load', () => setCoverSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = async (type) => {
    const ref = type === 'avatar' ? avatarRef : coverRef;
    const crop = type === 'avatar' ? avatarCrop : coverCrop;

    if (ref.current && crop?.width && crop?.height) {
      const croppedImageUrl = await getCroppedImg(
        ref.current,
        crop,
        `${type}.jpeg`
      );
      const file = dataURLtoFile(croppedImageUrl, `${type}.jpeg`);
      
      setData(type, file);
      post(route(`profile.update.${type}`), {
        onSuccess: () => {
          setAvatarSrc(null);
          setCoverSrc(null);
          setAvatarCrop(null);
          setCoverCrop(null);
          setMode(null);
          window.location.reload();
        }
      });
    }
  };

  const handleDeleteImage = (type) => {
    if (confirm(`Are you sure you want to delete your ${type}?`)) {
      destroy(route(`profile.delete.${type}`), {
        onSuccess: () => {
          window.location.reload();
        }
      });
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg');
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const sortedVideos = [...videos].sort((a, b) => {
    if (sort === 'latest') return new Date(b.created_at) - new Date(a.created_at);
    if (sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sort === 'popular') return b.views - a.views;
    return 0;
  });

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <AuthenticatedLayout
    
    >
      <Head title={`Profile of ${user.name}`} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <div className={`relative mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Cover Image */}
            <div className="relative group">
              {mode === 'cover' && coverSrc ? (
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-white/50">
                  <ReactCrop
                    crop={coverCrop}
                    onChange={c => setCoverCrop(c)}
                    aspect={851/315}
                  >
                    <img
                      ref={coverRef}
                      src={coverSrc}
                      alt="Cover preview"
                      className="w-full h-[400px] object-cover"
                    />
                  </ReactCrop>
                  <div className="absolute bottom-6 right-6 flex gap-3">
                    <button
                      onClick={() => handleCropComplete('cover')}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 font-semibold shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setCoverSrc(null);
                        setCoverCrop(null);
                        setMode(null);
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300 font-semibold shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-white/50">
                  <div className="relative h-[400px] bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 overflow-hidden">
                    <img
                      src={user.cover ? `/storage/${user.cover}` : '/images/default-cover.jpg'}
                      alt="Cover"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    
                    {isOwner && (
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                        <label className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-xl cursor-pointer shadow-lg transition-all duration-300 hover:scale-105">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={onCoverFileChange}
                            className="hidden"
                          />
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-semibold">Edit Cover</span>
                        </label>
                        {user.cover && (
                          <button
                            onClick={() => handleDeleteImage('cover')}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600/90 backdrop-blur-sm hover:bg-red-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="font-semibold">Delete</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar & Profile Info */}
            <div className="relative -mt-24 px-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between space-y-6 lg:space-y-0">
                
                {/* Avatar Section */}
                <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="relative group">
                    {mode === 'avatar' && avatarSrc ? (
                      <div className="relative">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-6 border-white shadow-2xl bg-white">
                          <ReactCrop
                            crop={avatarCrop}
                            onChange={c => setAvatarCrop(c)}
                            aspect={1}
                            circularCrop
                          >
                            <img
                              ref={avatarRef}
                              src={avatarSrc}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          </ReactCrop>
                        </div>
                        <div className="absolute -bottom-2 -right-2 flex gap-2">
                          <button
                            onClick={() => handleCropComplete('avatar')}
                            className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300 shadow-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setAvatarSrc(null);
                              setAvatarCrop(null);
                              setMode(null);
                            }}
                            className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300 shadow-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={user.avatar ? `/storage/${user.avatar}` : '/images/default-avatar.jpg'}
                          alt="Avatar"
                          className="w-48 h-48 object-cover rounded-full border-6 border-white shadow-2xl bg-white"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.jpg';
                          }}
                        />
                        {isOwner && (
                          <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                            <label className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-105">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={onAvatarFileChange}
                                className="hidden"
                              />
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </label>
                            {user.avatar && (
                              <button
                                onClick={() => handleDeleteImage('avatar')}
                                className="p-3 bg-red-600/90 backdrop-blur-sm hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="text-center lg:text-left">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {user.name}
                    </h1>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-2 lg:space-y-0 text-gray-600">
                      <span className="flex items-center justify-center lg:justify-start space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">{videos.length} videos</span>
                      </span>
                      <span className="flex items-center justify-center lg:justify-start space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        <span className="font-semibold">
                          {formatViews(videos.reduce((total, video) => total + video.views, 0))} total views
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center lg:justify-end">
                  {auth?.user && user.id !== auth.user.id && (
                    <button
                      onClick={() => router.post(`/subscribe/${user.id}`)}
                      className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        followStatus 
                          ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={followStatus ? "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                      </svg>
                      <span>{followStatus ? 'Unfollow' : `Subscribe to ${user.name}`}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Videos Section */}
          <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8">
              
              {/* Section Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Videos ({videos.length})
                </h2>
                
                {/* Sort Controls */}
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-purple-500 focus:ring-0 transition-colors duration-300 bg-white/80"
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most Viewed</option>
                  </select>
                </div>
              </div>

              {/* Videos Grid */}
              {sortedVideos.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Videos Yet</h3>
                  <p className="text-gray-600 text-lg">
                    {isOwner ? "You haven't uploaded any videos yet." : `${user.name} hasn't uploaded any videos yet.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className="group transform transition-all duration-500 hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <a
                        href={`/watch/${video.slug}`}
                        className="block bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50"
                      >
                        {/* Video Thumbnail */}
                        <div className="relative overflow-hidden">
                          <img
                            src={video.thumbnail ? `/storage/${video.thumbnail}` : '/images/default-thumbnail.jpg'}
                            alt={video.title}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = '/images/default-thumbnail.jpg';
                            }}
                          />
                          
                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-7 h-7 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                          
                          {/* Views Badge */}
                          <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {formatViews(video.views)} views
                          </div>
                          
                          {/* Duration Badge */}
                          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                            3:24
                          </div>
                        </div>
                        
                        {/* Video Info */}
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                            {video.title}
                          </h3>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                              </svg>
                              <span>{formatViews(video.views)}</span>
                            </span>
                            <span>{formatDate(video.created_at)}</span>
                          </div>
                          
                          {/* Hover Action */}
                          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="text-sm text-purple-600 font-semibold group-hover:text-blue-600 transition-colors duration-300">
                              Watch Now →
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-indigo-300/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}