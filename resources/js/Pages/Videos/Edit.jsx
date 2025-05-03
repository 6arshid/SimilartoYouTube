import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Dashboard({ video, auth }) {
  const { data, setData, post, processing, errors } = useForm({
    title: video.title,
    description: video.description || '',
    thumbnail: null,
    _method: 'put',
  });

  const onDropThumbnail = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setData('thumbnail', acceptedFiles[0]);
    }
  }, [setData]);

  const thumbnailDropzone = useDropzone({
    onDrop: onDropThumbnail,
    maxFiles: 1,
    accept: { 'image/*': [] },
  });

  const submit = (e) => {
    e.preventDefault();
    post(`/videos/${video.id}`);
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Video</h2>}
    >
      <Head title={`Edit Video "${video.title}"`} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Video</h1>

            <video controls src={`/storage/${video.path}`} className="w-full rounded mb-6" />

            {video.thumbnail && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Current Thumbnail:</p>
                <img
                  src={`/storage/${video.thumbnail}`}
                  alt="Thumbnail"
                  className="w-48 h-28 object-cover rounded border"
                />
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title:</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description:</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="3"
                />
                {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Replace Thumbnail (optional):</label>
                <div
                  {...thumbnailDropzone.getRootProps({
                    className:
                      'border-2 border-dashed p-4 text-center cursor-pointer ' +
                      (thumbnailDropzone.isDragActive ? 'bg-gray-100' : ''),
                  })}
                >
                  <input {...thumbnailDropzone.getInputProps()} />
                  {data.thumbnail ? (
                    <p className="text-green-600">Selected: {data.thumbnail.name}</p>
                  ) : (
                    <p className="text-gray-600">Drag & drop a new thumbnail here or click to select</p>
                  )}
                </div>
                {errors.thumbnail && <div className="text-red-600 text-sm mt-1">{errors.thumbnail}</div>}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Video
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
