// resources/js/Pages/Videos/Create.jsx
import { useState, useCallback } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';

export default function Create(props) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    video: null
  });

  // تنظیمات Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      // فقط اولین فایل (تک فایل)
      setData('video', acceptedFiles[0]);
    }
  }, [setData]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] }  // قبول تمام فرمت‌های ویدیویی
  });

  const submit = (e) => {
    e.preventDefault();
    post('/videos');  // ارسال فرم به route store (متد POST /videos)
  };

  return (
    <>
      <Head title="آپلود ویدیو جدید" />
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">آپلود ویدیوی جدید</h1>
        <form onSubmit={submit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">عنوان ویدیو:</label>
            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                   className="w-full rounded border-gray-300" />
            {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">توضیحات:</label>
            <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                      className="w-full rounded border-gray-300" rows="3" />
            {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">فایل ویدیو:</label>
            <div {...getRootProps({ className: 'border-2 border-dashed p-4 text-center cursor-pointer ' + (isDragActive ? 'bg-gray-100' : '') })}>
              <input {...getInputProps()} />
              {data.video ? (
                <p className="text-green-600">فایل انتخاب شده: {data.video.name}</p>
              ) : (
                <p className="text-gray-600">فایل ویدیویی خود را اینجا بکشید و رها کنید یا کلیک کنید</p>
              )}
            </div>
            {errors.video && <div className="text-red-600 text-sm mt-1">{errors.video}</div>}
          </div>
          <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">
            ذخیره ویدیو
          </button>
        </form>
      </div>
    </>
  );
}
