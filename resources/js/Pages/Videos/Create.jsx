import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Dashboard() {
  const { data, setData, post, processing, errors, progress } = useForm({
    title: '',
    description: '',
    video: null,
    thumbnail: null,
  });

  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadStep, setUploadStep] = useState(1); // 1: Details, 2: Files, 3: Review

  const onDropVideo = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      setData('video', file);
      
      // Create video preview
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  }, []);

  const onDropThumbnail = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      setData('thumbnail', file);
      
      // Create thumbnail preview
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  }, []);

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDropActive,
  } = useDropzone({
    onDrop: onDropVideo,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/avi': ['.avi'],
      'video/mov': ['.mov'],
    },
    maxFiles: 1,
  });

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
    isDragActive: isThumbnailDropActive,
  } = useDropzone({
    onDrop: onDropThumbnail,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/videos');
  };

  const removeVideo = () => {
    setData('video', null);
    setVideoPreview(null);
  };

  const removeThumbnail = () => {
    setData('thumbnail', null);
    setThumbnailPreview(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const steps = [
    { id: 1, name: 'Video Details', icon: 'info' },
    { id: 2, name: 'Upload Files', icon: 'upload' },
    { id: 3, name: 'Review & Publish', icon: 'check' }
  ];

  const getStepIcon = (iconName, isActive, isCompleted) => {
    const baseClasses = "w-5 h-5";
    const iconColor = isCompleted ? "text-green-600" : isActive ? "text-white" : "text-gray-400";
    
    const icons = {
      info: (
        <svg className={`${baseClasses} ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
        </svg>
      ),
      upload: (
        <svg className={`${baseClasses} ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
      ),
      check: (
        <svg className={`${baseClasses} ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
        </svg>
      )
    };
    return icons[iconName] || icons.info;
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <span>Upload New Video</span>
        </div>
      }
    >
      <Head title="Upload Video" />

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
          <nav className="flex items-center justify-center">
            <ol className="flex items-center space-x-8">
              {steps.map((step, stepIdx) => {
                const isActive = uploadStep === step.id;
                const isCompleted = uploadStep > step.id;
                
                return (
                  <li key={step.id} className="flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-green-100 border-green-600' 
                          : isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent' 
                            : 'bg-gray-100 border-gray-300'
                      }`}>
                        {getStepIcon(step.icon, isActive, isCompleted)}
                      </div>
                      <div className="text-sm">
                        <div className={`font-medium ${
                          isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </div>
                        <div className="text-gray-400">Step {step.id}</div>
                      </div>
                    </div>
                    {stepIdx < steps.length - 1 && (
                      <div className={`ml-8 w-16 h-0.5 transition-colors duration-300 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Video Details */}
          {uploadStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Video Information</h3>
                  <p className="text-gray-600">Tell us about your amazing content</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Enter an engaging title for your video"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                  {errors.title && (
                    <div className="flex items-center space-x-2 mt-2 text-red-600 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      <span>{errors.title}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Describe your video content, what viewers can expect, and any relevant details..."
                    rows="6"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                  />
                  {errors.description && (
                    <div className="flex items-center space-x-2 mt-2 text-red-600 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      <span>{errors.description}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => setUploadStep(2)}
                  disabled={!data.title.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="flex items-center space-x-2">
                    <span>Next Step</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: File Upload */}
          {uploadStep === 2 && (
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Upload Files</h3>
                  <p className="text-gray-600">Add your video and thumbnail</p>
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Video File *
                </label>
                <div
                  {...getVideoRootProps()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isVideoDropActive
                      ? 'border-blue-500 bg-blue-50/50'
                      : data.video
                        ? 'border-green-500 bg-green-50/50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
                  }`}
                >
                  <input {...getVideoInputProps()} />
                  
                  {data.video ? (
                    <div className="space-y-4">
                      {videoPreview && (
                        <div className="relative max-w-md mx-auto">
                          <video
                            src={videoPreview}
                            controls
                            className="w-full h-48 object-cover rounded-xl shadow-lg"
                          />
                        </div>
                      )}
                      <div className="bg-white/80 rounded-xl p-4 max-w-md mx-auto">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 truncate max-w-48">{data.video.name}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(data.video.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeVideo}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          {isVideoDropActive ? 'Drop your video here!' : 'Upload Video File'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Drag & drop or click to browse • MP4, WebM, AVI, MOV • Max 1GB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.video && (
                  <div className="flex items-center space-x-2 mt-3 text-red-600 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span>{errors.video}</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Thumbnail Image (Optional)
                </label>
                <div
                  {...getThumbnailRootProps()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    isThumbnailDropActive
                      ? 'border-blue-500 bg-blue-50/50'
                      : data.thumbnail
                        ? 'border-green-500 bg-green-50/50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
                  }`}
                >
                  <input {...getThumbnailInputProps()} />
                  
                  {data.thumbnail ? (
                    <div className="space-y-4">
                      {thumbnailPreview && (
                        <div className="relative max-w-xs mx-auto">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-full h-32 object-cover rounded-xl shadow-lg"
                          />
                        </div>
                      )}
                      <div className="bg-white/80 rounded-xl p-3 max-w-xs mx-auto">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm truncate max-w-32">{data.thumbnail.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(data.thumbnail.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeThumbnail}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {isThumbnailDropActive ? 'Drop thumbnail here!' : 'Upload Thumbnail'}
                        </p>
                        <p className="text-sm text-gray-500">JPG, PNG, WebP • Recommended: 16:9 ratio</p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.thumbnail && (
                  <div className="flex items-center space-x-2 mt-3 text-red-600 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span>{errors.thumbnail}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setUploadStep(1)}
                  className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span>Previous</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadStep(3)}
                  disabled={!data.video}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="flex items-center space-x-2">
                    <span>Review Upload</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Publish */}
          {uploadStep === 3 && (
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Review & Publish</h3>
                  <p className="text-gray-600">Everything looks good? Let's publish your video!</p>
                </div>
              </div>

              {/* Review Summary */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <h4 className="text-lg font-bold text-gray-800 mb-6">Upload Summary</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Video Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Title</label>
                      <p className="text-gray-900 font-medium">{data.title}</p>
                    </div>
                    
                    {data.description && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Description</label>
                        <p className="text-gray-900 text-sm leading-relaxed">{data.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Video File</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-sm text-gray-900">{data.video?.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">{formatFileSize(data.video?.size)}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Thumbnail</label>
                        <div className="flex items-center space-x-2 mt-1">
                          {data.thumbnail ? (
                            <>
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              <span className="text-sm text-gray-900">{data.thumbnail.name}</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                              <span className="text-sm text-gray-500">Auto-generated</span>
                            </>
                          )}
                        </div>
                        {data.thumbnail && <p className="text-xs text-gray-500">{formatFileSize(data.thumbnail.size)}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-600">Preview</label>
                    <div className="bg-gray-100 rounded-xl overflow-hidden">
                      {videoPreview ? (
                        <video
                          src={videoPreview}
                          controls
                          poster={thumbnailPreview}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                            </svg>
                            <p className="text-gray-500 text-sm">Video Preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {processing && progress && (
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-spin">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">Uploading Your Video</h4>
                      <p className="text-sm text-blue-700">Please don't close this page</p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">{Math.round(progress.percentage || 0)}% completed</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setUploadStep(2)}
                  disabled={processing}
                  className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span>Back to Files</span>
                  </span>
                </button>

                <button
                  type="submit"
                  disabled={processing || !data.video || !data.title.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="flex items-center space-x-2">
                    {processing ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                        </svg>
                        <span>Publish Video</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </AuthenticatedLayout>
  );
}