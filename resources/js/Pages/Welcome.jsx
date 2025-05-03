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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Welcome
                </h2>
            }
        >
            <Head title="Welcome" />

            <div className="p-6 text-right">
                {canLogin && (
                    user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                Log in
                            </Link>

                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )
                )}
            </div>

            <div className="flex flex-col items-center justify-center mt-10">
                <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">Welcome to Video Platform</h1>
            </div>

            {topVideos.length > 0 && (
                <section className="mt-12 px-6 max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Most Viewed Videos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {topVideos.map(video => (
                            <a
                                key={video.id}
                                href={`/watch/${video.slug}`}
                                className="block border rounded overflow-hidden shadow hover:shadow-lg transition"
                            >
                                <img
                                    src={video.thumbnail ? `/storage/${video.thumbnail}` : '/images/default-thumbnail.jpg'}
                                    onError={(e) => (e.target.src = '/images/default-thumbnail.jpg')}
                                    alt={video.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-3">
                                    <h3 className="font-semibold text-sm truncate text-gray-800 dark:text-white">{video.title}</h3>
                                    <p className="text-xs text-gray-500">👁️ {video.views} views</p>
                                    <p className="text-xs text-gray-500">By {video.user?.name || 'User'}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                    <p className="mt-2 text-gray-500 dark:text-gray-300">Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                </section>
            )}
        </AuthenticatedLayout>
    );
}
