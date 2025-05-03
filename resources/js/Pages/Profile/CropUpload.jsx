// resources/js/Pages/Profile/CropUpload.jsx
import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';
import getCroppedImg from './utils/cropImage';
import { useForm } from '@inertiajs/react';

export default function CropUpload() {
  const { post, processing, setData } = useForm({ avatar: null, cover: null });

  const [image, setImage] = useState(null);
  const [isAvatar, setIsAvatar] = useState(true);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = (e, avatar = true) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsAvatar(avatar);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const croppedBlob = await getCroppedImg(image, croppedAreaPixels, isAvatar ? 'avatar' : 'cover');
    const file = new File([croppedBlob], `${isAvatar ? 'avatar' : 'cover'}.jpg`, { type: 'image/jpeg' });

    setData(isAvatar ? 'avatar' : 'cover', file);
    post(route('profile.avatar.update'), {
      onSuccess: () => {
        setImage(null);
        setCroppedAreaPixels(null);
      },
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">آپلود آواتار یا کاور</h2>

      <div className="mb-4 space-y-2">
        <label>انتخاب آواتار (200x200):</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} />

        <label>انتخاب کاور (851x315):</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, false)} />
      </div>

      {image && (
        <div className="relative w-full h-[300px] bg-black mb-4">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={isAvatar ? 1 : 851 / 315}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {image && (
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={processing}
        >
          ذخیره تصویر بریده‌شده
        </button>
      )}
    </div>
  );
}
