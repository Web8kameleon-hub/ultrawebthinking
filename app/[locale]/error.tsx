// app/[locale]/error.tsx
'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

interface LocaleMessages {
    [key: string]: {
        title: string;
        description: string;
        tryAgain: string;
        goHome: string;
        helpText: string;
    };
}

const messages: LocaleMessages = {
    en: {
        title: "Something went wrong",
        description: "An unexpected error occurred. Please try again or return to the homepage.",
        tryAgain: "Try Again",
        goHome: "Go Home",
        helpText: "If the problem persists, please contact the administrator."
    },
    al: {
        title: "Diçka shkoi gabim",
        description: "Ndodhi një gabim i papritur. Ju lutemi provoni përsëri ose kthehuni në faqen kryesore.",
        tryAgain: "Provo Përsëri",
        goHome: "Faqja Kryesore",
        helpText: "Nëse problemi vazhdon, kontaktoni administratorin."
    }
};

export default function LocaleError({ error, reset }: ErrorProps) {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const msg = messages[locale] || messages.en;

    React.useEffect(() => {
        // Log the error to an error reporting service
        console.error('Locale Application Error:', error, 'Locale:', locale);
    }, [error, locale]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
            <div className="max-w-md w-full mx-auto text-center p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    {/* Error Icon */}
                    <div className="mb-6">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-6xl font-bold text-red-500 mb-2">Error</h1>
                        <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>
                    </div>

                    {/* Error Message */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            {msg.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            {msg.description}
                        </p>

                        {/* Error Details (only in development) */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="text-left bg-gray-100 p-4 rounded-lg mb-4">
                                <p className="text-sm font-mono text-red-600 break-all">
                                    {error.message}
                                </p>
                                {error.digest && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Digest: {error.digest}
                                    </p>
                                )}
                                <p className="text-xs text-blue-600 mt-1">
                                    Locale: {locale}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {msg.tryAgain}
                        </button>

                        <Link
                            href={`/${locale}`}
                            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            {msg.goHome}
                        </Link>
                    </div>

                    {/* Additional Help */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            {msg.helpText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
