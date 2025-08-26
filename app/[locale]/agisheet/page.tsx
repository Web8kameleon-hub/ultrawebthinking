// app/[locale]/agisheet/page.tsx
import { LiveAGISheet } from '../../../components/LiveAGISheet';

export default function AGISheetPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-full mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        AGI Sheet - Live Excel Format
                    </h1>
                    <p className="text-gray-600">
                        Industrial-grade spreadsheet with AI-powered analysis and real-time collaboration
                    </p>
                </div>

                <div className="h-[calc(100vh-200px)]">
                    <LiveAGISheet />
                </div>
            </div>
        </div>
    );
}
