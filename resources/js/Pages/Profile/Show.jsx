// resources/js/Pages/Profile/Show.jsx
import { usePage, Head, useForm } from '@inertiajs/react';
import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './utils/cropImage';

export default function Profile() {
  const { user: initialUser, videos } = usePage().props;
  const [user, setUser] = useState(initialUser);
  const [sort, setSort] = useState('latest');
  const [cropModal, setCropModal] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { post, setData, processing, clearErrors } = useForm({ avatar: null, cover: null });

  const onCropComplete = useCallback((_, cropped) => {
    setCroppedAreaPixels(cropped);
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropModal(type);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, cropModal);
    const file = new File([croppedBlob], `${cropModal}.jpg`, { type: 'image/jpeg' });
    setData(cropModal, file);

    post(route('profile.avatar.update'), {
      preserveScroll: true,
      onSuccess: () => {
        fetch(`/api/user/${initialUser.id}`)
          .then(res => res.json())
          .then(data => {
            setUser(data);
            setCropModal(null);
            setImageSrc(null);
            clearErrors();
          });
      },
    });
  };

  const sortedVideos = [...videos].sort((a, b) => {
    if (sort === 'latest') return new Date(b.created_at) - new Date(a.created_at);
    if (sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sort === 'popular') return b.views - a.views;
    return 0;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Head title={`پروفایل ${user.name}`} />

      <h1 className="text-2xl font-bold mb-4">پروفایل {user.name}</h1>

      {/* Cover Section */}
      <div className="relative mb-6">
        <img
          src={user.cover ? `/storage/${user.cover}` : '/images/default-cover.jpg'}
          alt="کاور"
          className="w-full h-[315px] object-cover rounded"
        />
        <label className="absolute top-3 right-3 bg-white p-1 rounded-full shadow cursor-pointer">
          📷
          <input type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'cover')} />
        </label>
        <img
          src={user.avatar ? `/storage/${user.avatar}` : '/images/default-avatar.jpg'}
          alt="آواتار"
          className="w-[200px] h-[200px] object-cover rounded-full border-4 border-white absolute bottom-[-100px] left-6 bg-white"
        />
        <label className="absolute bottom-[-110px] left-[160px] bg-white p-1 rounded-full shadow cursor-pointer">
          📷
          <input type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'avatar')} />
        </label>
      </div>

      {/* Crop Modal */}
      {cropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-full max-w-lg">
            <div className="relative w-full h-[300px] bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropModal === 'avatar' ? 1 : 851 / 315}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setCropModal(null)} className="text-gray-600" disabled={processing}>
                لغو
              </button>
              <button
                onClick={handleCropSave}
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                disabled={processing}
              >
                {processing && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                )}
                ذخیره تصویر
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-12 mt-28 space-y-4">
        <div className="mb-4 flex gap-4 items-center">
          <span className="font-semibold">مرتب‌سازی بر اساس:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded p-1"
          >
            <option value="latest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="popular">پربازدیدترین</option>
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
                <p className="text-xs text-gray-500">👁️ {video.views} بازدید</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}