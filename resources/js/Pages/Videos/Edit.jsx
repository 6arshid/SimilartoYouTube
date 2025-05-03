// resources/js/Pages/Videos/Edit.jsx
import { useState, useCallback } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';

export default function Edit(props) {
  const { video } = props;

  const { data, setData, post, processing, errors } = useForm({
    title: video.title,
    description: video.description || '',
    video: null,
    thumbnail: null,
    _method: 'put'
  });

  const onDropVideo = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setData('video', acceptedFiles[0]);
    }
  }, [setData]);

  const onDropThumbnail = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setData('thumbnail', acceptedFiles[0]);
    }
  }, [setData]);

  const videoDropzone = useDropzone({
    onDrop: onDropVideo,
    maxFiles: 1,
    accept: { 'video/*': [] }
  });

  const thumbnailDropzone = useDropzone({
    onDrop: onDropThumbnail,
    maxFiles: 1,
    accept: { 'image/*': [] }
  });

  const submit = (e) => {
    e.preventDefault();
    post(`/videos/${video.id}`);
  };

  return (
    <>
      <Head title={`ویرایش ویدیو \"${video.title}\"`} />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-4">ویرایش ویدیو</h1>

        <video
          controls
          src={`/storage/${video.path}`}
          className="w-full rounded mb-6"
        />

        <form onSubmit={submit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">عنوان ویدیو:</label>
            <input
              type="text"
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              className="w-full rounded border-gray-300"
            />
            {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">توضیحات:</label>
            <textarea
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              className="w-full rounded border-gray-300"
              rows="3"
            />
            {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
          </div>

          {/* Dropzone برای ویدیو */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">تغییر فایل ویدیو (اختیاری):</label>
            <div {...videoDropzone.getRootProps({ className: 'border-2 border-dashed p-4 text-center cursor-pointer ' + (videoDropzone.isDragActive ? 'bg-gray-100' : '') })}>
              <input {...videoDropzone.getInputProps()} />
              {data.video ? (
                <p className="text-green-600">ویدیو انتخاب شده: {data.video.name}</p>
              ) : (
                <p className="text-gray-600">برای تغییر ویدیو، فایل را اینجا بکشید یا کلیک کنید</p>
              )}
            </div>
            {errors.video && <div className="text-red-600 text-sm mt-1">{errors.video}</div>}
          </div>

          {/* Dropzone برای thumbnail */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">تغییر تصویر thumbnail (اختیاری):</label>
            <div {...thumbnailDropzone.getRootProps({ className: 'border-2 border-dashed p-4 text-center cursor-pointer ' + (thumbnailDropzone.isDragActive ? 'bg-gray-100' : '') })}>
              <input {...thumbnailDropzone.getInputProps()} />
              {data.thumbnail ? (
                <p className="text-green-600">عکس انتخاب شده: {data.thumbnail.name}</p>
              ) : (
                <p className="text-gray-600">برای تغییر thumbnail، عکس را اینجا بکشید یا کلیک کنید</p>
              )}
            </div>
            {errors.thumbnail && <div className="text-red-600 text-sm mt-1">{errors.thumbnail}</div>}
          </div>

          <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">
            بروزرسانی ویدیو
          </button>
        </form>
      </div>
    </>
  );
}
