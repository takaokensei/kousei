import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Loader2 } from 'lucide-react';

const PreviewPanel: React.FC = () => {
    const { pdfUrl, isCompiling } = useAppStore();

    return (
        <div className="h-full w-full bg-[#1a1b26] relative flex flex-col">
            {/* Loading Overlay */}
            {isCompiling && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
                        <span className="text-sm font-medium text-white">Compiling...</span>
                    </div>
                </div>
            )}

            {/* PDF Viewer */}
            {pdfUrl ? (
                <iframe
                    src={pdfUrl + "#toolbar=0&view=FitH"}
                    className="w-full h-full border-none"
                    title="PDF Preview"
                />
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    <p>No PDF generated yet. Press "Compile" to start.</p>
                </div>
            )}
        </div>
    );
};

export default PreviewPanel;
