import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const user = page?.props?.auth?.user || null;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchNotifications = () => {
            fetch('/notifications')
                .then(res => res.json())
                .then(setNotifications);
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Animated Background Overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-all duration-500 ease-in-out sm:static sm:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } hover:shadow-3xl`}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between h-20 border-b border-gradient-to-r from-blue-100 to-purple-100 px-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                    <Link href="/" className="transform hover:scale-105 transition-all duration-300">
                        <ApplicationLogo className="h-12 w-auto fill-current text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold" />
                    </Link>
                    <button
                        className="sm:hidden p-2 rounded-full hover:bg-gray-100/50 text-gray-500 hover:text-gray-700 transition-all duration-200"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-8 flex flex-col space-y-3 px-6">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</div>
                    
                    <NavLink 
                        href={route('videos.explorer')} 
                        active={route().current('videos.explorer')}
                        className="group relative overflow-hidden rounded-xl px-4 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h1A1.5 1.5 0 0 1 7 2.5V5h2V2.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5v2.382a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V14.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 14.5v-3a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5v3A1.5 1.5 0 0 1 5.5 16h-3A1.5 1.5 0 0 1 1 14.5V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882zM4.5 2a.5.5 0 0 0-.5.5V3h2v-.5a.5.5 0 0 0-.5-.5zM6 4H4v.882a1.5 1.5 0 0 1-.83 1.342l-.894.447A.5.5 0 0 0 2 7.118V13h4v-1.293l-.854-.853A.5.5 0 0 1 5 10.5v-1A1.5 1.5 0 0 1 6.5 8h3A1.5 1.5 0 0 1 11 9.5v1a.5.5 0 0 1-.146.354l-.854.853V13h4V7.118a.5.5 0 0 0-.276-.447l-.895-.447A1.5 1.5 0 0 1 12 4.882V4h-2v1.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5zm4-1h2v-.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm4 11h-4v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-8 0H2v.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5z"/>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Explorer</span>
                                <span className="text-xs text-gray-500">Discover content</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </NavLink>

                    <NavLink 
                        href={route('videos.feed')} 
                        active={route().current('videos.feed')}
                        className="group relative overflow-hidden rounded-xl px-4 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-1"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg group-hover:shadow-green-500/50 transition-all duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">My Feed</span>
                                <span className="text-xs text-gray-500">Your timeline</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </NavLink>

                    <NavLink 
                        href={route('videos.index')} 
                        active={route().current('videos.index')}
                        className="group relative overflow-hidden rounded-xl px-4 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553 2.276a1 1 0 010 1.448L15 16M4 6h16M4 12h8M4 18h16" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">My Videos</span>
                                <span className="text-xs text-gray-500">Your uploads</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </NavLink>

                    <NavLink 
                        href={route('playlists.my')} 
                        active={route().current('playlists.my')}
                        className="group relative overflow-hidden rounded-xl px-4 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-1"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2"/>
                                    <path fillRule="evenodd" d="M12 3v10h-1V3z"/>
                                    <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z"/>
                                    <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"/>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">My Playlists</span>
                                <span className="text-xs text-gray-500">Your collections</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </NavLink>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative">
                <header className="flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-white/30 h-20 px-6 sm:px-8 lg:px-10 shadow-lg relative z-10">
                    {/* Mobile Menu Button */}
                    <button
                        className="sm:hidden p-3 rounded-xl hover:bg-white/50 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-lg"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Header Title */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text">
                            {header}
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-6 relative" ref={dropdownRef}>
                        {user ? (
                            <>
                                {/* Notifications */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowNotif(prev => !prev)} 
                                        className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                                        </svg>
                                        {notifications.some(n => !n.read) && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold animate-pulse">
                                                {notifications.filter(n => !n.read).length}
                                            </span>
                                        )}
                                    </button>

                                    {showNotif && (
                                        <div className="absolute right-0 mt-3 w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                                                <span className="font-bold text-gray-800">Notifications</span>
                                                <button
                                                    onClick={() => {
                                                        fetch('/notifications/mark-read', {
                                                            method: 'GET',
                                                            headers: {
                                                              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                                              'Content-Type': 'application/json',
                                                            },
                                                          })
                                                          .then(() => {
                                                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                                          });
                                                    }}
                                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                                >
                                                    Mark all as read
                                                </button>
                                            </div>
                                            <ul className="max-h-80 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <li className="p-6 text-gray-500 text-center">
                                                        <div className="text-4xl mb-2">🔔</div>
                                                        <div>No notifications</div>
                                                    </li>
                                                ) : (
                                                    notifications.map(n => (
                                                        <li
                                                            key={n.id}
                                                            className={`px-6 py-4 border-b border-gray-100/30 hover:bg-gray-50/50 transition-colors ${n.read ? 'text-gray-500' : 'text-gray-800 font-medium bg-blue-50/30'}`}
                                                        >
                                                            <a href={n.url} className="hover:text-blue-600 transition-colors">{n.message}</a>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* User Profile */}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileDropdownOpen((prev) => !prev)}
                                        className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/50 hover:bg-white/70 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-800 hidden sm:block">{user.name}</span>
                                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {profileDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 overflow-hidden">
                                            <Link
                                                href={route('profile.show', user.id)}
                                                className="block px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Show Profile</span>
                                                </div>
                                            </Link>
                                            <Link
                                                href={route('profile.edit')}
                                                className="block px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                    <span>Edit Profile</span>
                                                </div>
                                            </Link>
                                            <hr className="my-2 border-gray-200/50" />
                                            <button
                                                type="button"
                                                onClick={() => router.post(route('logout'))}
                                                className="block w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Log Out</span>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href={route('register')} 
                                    className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                >
                                    Register
                                </Link>
                                <Link 
                                    href={route('login')} 
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white/40 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 min-h-[calc(100vh-12rem)]">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 sm:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}