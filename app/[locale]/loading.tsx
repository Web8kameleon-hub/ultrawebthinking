// app/[locale]/loading.tsx
'use client';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

interface LocaleMessages {
    [key: string]: {
        title: string;
        description: string;
    };
}

const messages: LocaleMessages = {
    en: {
        title: "Loading...",
        description: "Please wait while we load the content."
    },
    al: {
        title: "Po ngarkon...",
        description: "Ju lutemi prisni ndërsa ngarkojmë përmbajtjen."
    }
};

export default function LocaleLoading() {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const msg = messages[locale] || messages.en;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    {/* Loading Icon */}
                    <div className="mb-6">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                    </div>

                    {/* Loading Message */}
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {msg.title}
                        </h2>
                        <p className="text-gray-600">
                            {msg.description}
                        </p>
                    </div>

                    {/* Loading Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>

                    {/* Debug Info (only in development) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
                            Locale: {locale}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
