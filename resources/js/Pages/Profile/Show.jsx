import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Head, useForm, router  } from '@inertiajs/react';
import { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function Profile() {
  const { auth, user: initialUser, videos,isFollowing  } = usePage().props;
  const isOwner = auth?.user?.id === initialUser.id;
  const [user, setUser] = useState(initialUser);
  const [sort, setSort] = useState('latest');
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [coverSrc, setCoverSrc] = useState(null);
  const [avatarCrop, setAvatarCrop] = useState(null);
  const [coverCrop, setCoverCrop] = useState(null);
  const [mode, setMode] = useState(null);
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const { post, setData, delete: destroy } = useForm();

  const onAvatarFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setMode('avatar');
      const reader = new FileReader();
      reader.addEventListener('load', () => setAvatarSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };
// تابع برای crop و resize تصویر
const processImage = async (imageRef, crop, targetWidth, targetHeight) => {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  const image = imageRef.current;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // محاسبه مختصات و ابعاد crop
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  // رسم تصویر با سایز نهایی
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

// تابع برای آپلود آواتار
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

// تابع برای آپلود کاور
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
const followStatus = typeof isFollowing !== 'undefined' ? isFollowing : false;


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

  return (
     <AuthenticatedLayout
     header={
      <h2 className="text-xl font-semibold leading-tight text-gray-800">
         Profile of {user.name}
      </h2>
  }
  >
    
    <div className="p-6 max-w-5xl mx-auto">
      <Head title={`Profile of ${user.name}`} />

    

      <div className="relative mb-6">
        {/* Cover Image */}
        <div className="relative group">
          {mode === 'cover' && coverSrc ? (
            <div className="relative">
              <ReactCrop
                crop={coverCrop}
                onChange={c => setCoverCrop(c)}
                aspect={851/315}
              >
                <img
                  ref={coverRef}
                  src={coverSrc}
                  alt="Cover preview"
                  className="w-full h-[315px] object-cover rounded"
                />
              </ReactCrop>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => handleCropComplete('cover')}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setCoverSrc(null);
                    setCoverCrop(null);
                    setMode(null);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <img
                src={user.cover ? `/storage/${user.cover}` : '/images/default-cover.jpg'}
                alt="Cover"
                className="w-full h-[315px] object-cover rounded"
              />
              {isOwner && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <label className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full cursor-pointer shadow">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onCoverFileChange}
                      className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </label>
                  {user.cover && (
                    <button
                      onClick={() => handleDeleteImage('cover')}
                      className="bg-white/80 hover:bg-white text-red-500 p-2 rounded-full shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Avatar Image */}
        <div className="relative">
          {mode === 'avatar' && avatarSrc ? (
            <div className="absolute bottom-[-100px] left-6">
              <div className="relative">
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
                    className="w-[200px] h-[200px] object-cover rounded-full border-4 border-white bg-white"
                  />
                </ReactCrop>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleCropComplete('avatar')}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setAvatarSrc(null);
                      setAvatarCrop(null);
                      setMode(null);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-[-100px] left-6 group">
              <img
                src={user.avatar ? `/storage/${user.avatar}` : '/images/default-avatar.jpg'}
                alt="Avatar"
                className="w-[200px] h-[200px] object-cover rounded-full border-4 border-white bg-white"
              />
              {isOwner && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <label className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full cursor-pointer shadow">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarFileChange}
                      className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </label>
                  {user.avatar && (
                    <button
                      onClick={() => handleDeleteImage('avatar')}
                      className="bg-white/80 hover:bg-white text-red-500 p-2 rounded-full shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      <div className="mb-12 mt-28 space-y-4">
      {auth?.user && user.id !== auth.user.id && (
  <button
    onClick={() => router.post(`/subscribe/${user.id}`)}
    className={`px-4 py-2 rounded ${isFollowing ? 'bg-red-600' : 'bg-purple-600'} text-white`}
  >
    {isFollowing ? 'Unfollow' : `Subscribe to ${user.name || 'user'}`}
  </button>
)}
        <div className="mb-4 flex gap-4 items-center">
          <span className="font-semibold">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded p-1"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Viewed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedVideos.map(video => (
            <a
              key={video.id}
              href={`/watch/${video.slug}`}
              className="border rounded overflow-hidden hover:shadow"
            >
              <img
                src={video.thumbnail ? `/storage/${video.thumbnail}` : '/images/default-thumbnail.jpg'}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <h2 className="font-semibold text-sm text-gray-800 line-clamp-2">{video.title}</h2>
                <p className="text-xs text-gray-500">👁️ {video.views} views</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
}