import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Welcome({ laravelVersion, phpVersion, canLogin, canRegister, topVideos = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                    </div>
                    <span>Welcome to Your Video Platform</span>
                </div>
            }
        >
            <Head title="Welcome" />

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full blur-xl animate-pulse delay-2000"></div>
                </div>

                {/* Main Hero Content */}
                <div className="relative flex flex-col items-center justify-center py-20 text-center">
                    {/* Logo with Animation */}
                    <div className="transform hover:scale-110 transition-all duration-500 mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                            <div className="relative bg-white rounded-full p-6 shadow-2xl">
                                <ApplicationLogo className="w-16 h-16 fill-current text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text" />
                            </div>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="space-y-4 mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text leading-tight">
                            Welcome to the Future
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
                            of Video Streaming
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Discover, share, and enjoy amazing content from creators around the world. 
                            Your journey into immersive video experiences starts here.
                        </p>
                    </div>

                

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
                        <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">10K+</div>
                                    <div className="text-sm text-gray-600">Videos</div>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">5K+</div>
                                    <div className="text-sm text-gray-600">Creators</div>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">100K+</div>
                                    <div className="text-sm text-gray-600">Users</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Videos Section */}
            {topVideos.length > 0 && (
                <section className="mt-8">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Most Viewed Videos</h2>
                                <p className="text-gray-600">Discover what's trending right now</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {topVideos.map((video, index) => (
                            <a
                                key={video.id}
                                href={`/watch/${video.slug}`}
                                className="group block bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                            >
                                {/* Video Thumbnail */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={video.thumbnail ? `/storage/${video.thumbnail}` : '/images/default-thumbnail.jpg'}
                                        onError={(e) => (e.target.src = '/images/default-thumbnail.jpg')}
                                        alt={video.title}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Ranking Badge */}
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm px-3 py-1 rounded-full shadow-lg">
                                        #{index + 1}
                                    </div>
                                    {/* Play Icon Overlay */}
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-white/90 rounded-full p-4 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Video Info */}
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-3">
                                        {video.title}
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="font-medium">{video.views.toLocaleString()} views</span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {video.user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span>By {video.user?.name || 'User'}</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer Info */}
            <div className="mt-16 text-center">
                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-lg border border-white/30">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700 font-medium">
                        Powered by Laravel v{laravelVersion} & PHP v{phpVersion}
                    </span>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}