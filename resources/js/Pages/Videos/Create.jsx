// resources/js/Pages/Videos/Create.jsx
import { useForm, Head } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Create() {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    video: null,
    thumbnail: null,
  });

  const onDropVideo = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setData('video', acceptedFiles[0]);
    }
  }, []);

  const onDropThumbnail = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setData('thumbnail', acceptedFiles[0]);
    }
  }, []);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    onDrop: onDropVideo,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    },
    maxFiles: 1,
  });

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    onDrop: onDropThumbnail,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/videos');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Head title="آپلود ویدیو" />

      <h1 className="text-2xl font-bold mb-6">آپلود ویدیو جدید</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">عنوان ویدیو</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
        </div>

        <div>
          <label className="block mb-1 font-medium">توضیحات</label>
          <textarea
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows="4"
          />
          {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
        </div>

        <div>
          <label className="block mb-1 font-medium">انتخاب ویدیو</label>
          <div {...getVideoRootProps()} className="border border-dashed border-gray-400 p-4 rounded cursor-pointer text-center">
            <input {...getVideoInputProps()} />
            {data.video ? (
              <p>{data.video.name}</p>
            ) : (
              <p className="text-gray-500">فایل ویدیویی را اینجا رها کنید یا کلیک کنید</p>
            )}
          </div>
          {errors.video && <div className="text-red-500 text-sm mt-1">{errors.video}</div>}
        </div>

        <div>
          <label className="block mb-1 font-medium">انتخاب تصویر کاور (اختیاری)</label>
          <div {...getThumbnailRootProps()} className="border border-dashed border-gray-400 p-4 rounded cursor-pointer text-center">
            <input {...getThumbnailInputProps()} />
            {data.thumbnail ? (
              <p>{data.thumbnail.name}</p>
            ) : (
              <p className="text-gray-500">فایل تصویر را اینجا رها کنید یا کلیک کنید</p>
            )}
          </div>
          {errors.thumbnail && <div className="text-red-500 text-sm mt-1">{errors.thumbnail}</div>}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          آپلود ویدیو
        </button>
      </form>
    </div>
  );
}