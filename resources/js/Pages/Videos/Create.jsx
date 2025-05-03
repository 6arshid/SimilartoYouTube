import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Dashboard() {
  const { data, setData, post, processing, errors } = useForm({
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

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
  } = useDropzone({
    onDrop: onDropVideo,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    },
    maxFiles: 1,
  });

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
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
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Upload Video
        </h2>
      }
    >
      <Head title="Upload Video" />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Video Title</label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.title && (
                  <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="4"
                />
                {errors.description && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Select Video File</label>
                <div
                  {...getVideoRootProps()}
                  className="border border-dashed border-gray-400 p-4 rounded cursor-pointer text-center"
                >
                  <input {...getVideoInputProps()} />
                  {data.video ? (
                    <p>{data.video.name}</p>
                  ) : (
                    <p className="text-gray-500">
                      Drop a video file here or click to select
                    </p>
                  )}
                </div>
                {errors.video && (
                  <div className="text-red-500 text-sm mt-1">{errors.video}</div>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Select Thumbnail (optional)
                </label>
                <div
                  {...getThumbnailRootProps()}
                  className="border border-dashed border-gray-400 p-4 rounded cursor-pointer text-center"
                >
                  <input {...getThumbnailInputProps()} />
                  {data.thumbnail ? (
                    <p>{data.thumbnail.name}</p>
                  ) : (
                    <p className="text-gray-500">
                      Drop an image here or click to select
                    </p>
                  )}
                </div>
                {errors.thumbnail && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.thumbnail}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upload Video
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
