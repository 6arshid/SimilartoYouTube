import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300/30 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-32 left-16 w-3 h-3 bg-pink-300/20 rounded-full animate-pulse delay-700"></div>
                <div className="absolute top-60 left-1/3 w-1 h-1 bg-blue-300/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 right-20 w-2 h-2 bg-indigo-300/25 rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-80 right-1/4 w-1 h-1 bg-white/15 rounded-full animate-pulse delay-800"></div>
            </div>

            {/* Header with logo */}
            <div className="relative z-10 w-full">
                <div className="flex justify-center pt-8 pb-4">
                    <Link href="/" className="group">
                        <div className="relative">
                            {/* Glowing background for logo */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                            
                            {/* Logo container */}
                            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 group-hover:bg-white/15 transition-all duration-300 shadow-xl">
                                <ApplicationLogo className="h-12 w-12 text-white drop-shadow-lg" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* App name/tagline */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white/90 mb-2">Your App Name</h1>
                    <p className="text-white/60 text-sm">Experience the future of digital innovation</p>
                </div>
            </div>

            {/* Main content area */}
            <div className="relative z-10 w-full flex-1">
                {children}
            </div>

            {/* Footer */}
            <div className="relative z-10 w-full">
                <div className="text-center py-8">
                    <div className="flex justify-center space-x-8 mb-4">
                        <Link href="/privacy" className="text-white/50 hover:text-white/70 text-sm transition-colors duration-200">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-white/50 hover:text-white/70 text-sm transition-colors duration-200">
                            Terms of Service
                        </Link>
                        <Link href="/support" className="text-white/50 hover:text-white/70 text-sm transition-colors duration-200">
                            Support
                        </Link>
                    </div>
                    <p className="text-white/40 text-xs">
                        © 2025 Your Company Name. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Decorative border gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            </div>
        </div>
    );
}