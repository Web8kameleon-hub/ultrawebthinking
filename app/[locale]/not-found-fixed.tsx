// app/[locale]/not-found.tsx
'use client';

import { AlertTriangle, ArrowLeft, Home, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface LocaleMessages {
    [key: string]: {
        title: string;
        subtitle: string;
        description: string;
        homeButton: string;
        backButton: string;
        helpText: string;
        suggestedPages: string;
        searchPlaceholder: string;
    };
}

const messages: LocaleMessages = {
    en: {
        title: "Page Not Found",
        subtitle: "Oops! This page doesn't exist",
        description: "The page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage.",
        homeButton: "Go Home",
        backButton: "Go Back",
        helpText: "If the problem persists, please contact the administrator.",
        suggestedPages: "Suggested Pages",
        searchPlaceholder: "Search for pages..."
    },
    al: {
        title: "Faqja nuk u gjet",
        subtitle: "Ups! Kjo faqe nuk ekziston",
        description: "Faqja që kërkoni nuk ekziston ose është zhvendosur. Ju lutemi kontrolloni URL-në ose kthehuni në faqen kryesore.",
        homeButton: "Faqja Kryesore",
        backButton: "Kthehu Prapa",
        helpText: "Nëse problemi vazhdon, kontaktoni administratorin.",
        suggestedPages: "Faqe të Sugjeruara",
        searchPlaceholder: "Kërko faqe..."
    }
};

export default function LocaleNotFound() {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const msg = messages[locale] || messages.en;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl w-full mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Column - Error Info */}
                    <div className="text-center lg:text-left">
                        <div className="mb-6">
                            <h1 className="text-9xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-4">404</h1>
                            <div className="w-24 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full lg:mx-0 mx-auto"></div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                {msg.title}
                            </h2>
                            <p className="text-xl text-gray-700 font-medium mb-4">
                                {msg.subtitle}
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {msg.description}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href={`/${locale}`}
                                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                {msg.homeButton}
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center justify-center px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                {msg.backButton}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Helpful Info */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                        {/* Search Section */}
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <Search className="w-6 h-6 text-blue-500 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-800">Quick Search</h3>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={msg.searchPlaceholder}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                />
                                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Suggested Pages */}
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <MapPin className="w-6 h-6 text-green-500 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-800">{msg.suggestedPages}</h3>
                            </div>
                            <div className="space-y-3">
                                <Link
                                    href={`/${locale}`}
                                    className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <div className="font-medium text-blue-800">🏠 Homepage</div>
                                    <div className="text-sm text-blue-600">Main dashboard and navigation</div>
                                </Link>
                                <Link
                                    href={`/${locale}/medical`}
                                    className="block p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <div className="font-medium text-green-800">💎 Medical Engine</div>
                                    <div className="text-sm text-green-600">SuperCrista medical analysis</div>
                                </Link>
                                <Link
                                    href={`/${locale}/dashboard`}
                                    className="block p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <div className="font-medium text-purple-800">📊 Dashboard</div>
                                    <div className="text-sm text-purple-600">Analytics and insights</div>
                                </Link>
                                <Link
                                    href={`/${locale}/agisheet`}
                                    className="block p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                                >
                                    <div className="font-medium text-amber-800">📋 AGI Sheet</div>
                                    <div className="text-sm text-amber-600">Live Excel-format spreadsheet</div>
                                </Link>
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                                <span className="font-medium text-yellow-800">Need Help?</span>
                            </div>
                            <p className="text-sm text-yellow-700">
                                {msg.helpText}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
