import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Animated background shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative w-full max-w-lg">
                    {/* Glassmorphism card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white">Verify Your Email</h1>
                            <p className="text-white/70 text-sm">Almost there! Just one more step</p>
                        </div>

                        {/* Main Message */}
                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-5">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 bg-blue-400/30 rounded-full flex items-center justify-center">
                                        <svg className="h-4 w-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-blue-200 font-medium text-sm mb-2">Check Your Inbox</h3>
                                    <p className="text-blue-100/90 text-sm leading-relaxed">
                                        Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just sent to you. If you didn't receive the email, we'll gladly send you another.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Message */}
                        {status === 'verification-link-sent' && (
                            <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-green-200 font-medium text-sm mb-1">Email Sent Successfully!</h4>
                                        <p className="text-green-100/80 text-sm">
                                            A new verification link has been sent to your email address.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Tips */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <h4 className="text-white font-medium text-sm mb-3 flex items-center">
                                <svg className="h-4 w-4 mr-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Can't find the email?
                            </h4>
                            <ul className="text-white/70 text-sm space-y-2">
                                <li className="flex items-start">
                                    <svg className="h-3 w-3 mr-2 mt-1 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Check your spam or junk folder
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-3 w-3 mr-2 mt-1 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Wait a few minutes for delivery
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-3 w-3 mr-2 mt-1 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Use the resend button below
                                </li>
                            </ul>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <PrimaryButton
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 rounded-xl py-3 px-6 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Resend Email
                                        </div>
                                    )}
                                </PrimaryButton>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-6 text-white font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Log Out
                                </Link>
                            </div>
                        </form>

                        {/* Help Section */}
                        <div className="text-center pt-4 border-t border-white/10">
                            <p className="text-white/60 text-sm">
                                Need help?{' '}
                                <Link
                                    href="/support"
                                    className="text-purple-300 hover:text-purple-200 font-medium underline decoration-purple-300/50 hover:decoration-purple-200 underline-offset-2 transition-colors duration-200"
                                >
                                    Contact Support
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Bottom decorative element */}
                    <div className="mt-8 text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <p className="text-white/50 text-xs">
                                Secure email verification system
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}