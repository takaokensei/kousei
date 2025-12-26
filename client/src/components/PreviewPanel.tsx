import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { readFile } from '@tauri-apps/plugin-fs';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source (required for react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PreviewPanel: React.FC = () => {
    const { pdfUrl, isCompiling, filePath } = useAppStore();
    const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
    const [numPages, setNumPages] = useState<number>(0);

    // Reload PDF data when pdfUrl changes (indicating new compilation)
    useEffect(() => {
        const loadPdf = async () => {
            if (!filePath) return;
            const pdfPath = filePath.replace('.tex', '.pdf');

            try {
                // Read file as binary
                const data = await readFile(pdfPath);
                setPdfData(data);
            } catch (error) {
                console.error("Error reading PDF:", error);
                // If read fails (maybe verification only checked .tex), ignore or clear
            }
        };

        if (pdfUrl) {
            loadPdf();
        }
    }, [pdfUrl, filePath]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const docFile = React.useMemo(() => ({ data: pdfData }), [pdfData]);

    return (
        <div className="h-full w-full bg-[#525660] relative flex flex-col items-center overflow-auto py-8">
            {/* Loading Overlay */}
            {isCompiling && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm fixed">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
                        <span className="text-sm font-medium text-white">Compiling...</span>
                    </div>
                </div>
            )}

            {/* PDF Viewer */}
            {pdfData ? (
                <Document
                    file={docFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="shadow-2xl"
                    loading={<div className="text-white mt-10">Loading PDF...</div>}
                    error={<div className="text-red-400 p-4 mt-10">Failed to load PDF.</div>}
                >
                    {Array.from(new Array(numPages), (_, index) => (
                        <div key={`page_${index + 1}`} className="mb-4">
                            <Page
                                pageNumber={index + 1}
                                scale={1.2}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                            />
                        </div>
                    ))}
                </Document>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-300 select-none">
                    <p>No PDF generated yet. Press "Compile" to start.</p>
                </div>
            )}
        </div>
    );
};

export default PreviewPanel;
