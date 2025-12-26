import { create } from 'zustand';
import { TauriBridge, type Diagnostic } from '../services/TauriBridge';
import { convertFileSrc } from '@tauri-apps/api/core';

import { writeTextFile } from '@tauri-apps/plugin-fs';

interface AppState {
    code: string;
    filePath: string;
    isCompiling: boolean;
    pdfUrl: string | null;
    diagnostics: Diagnostic[];
    setCode: (code: string) => void;
    setFilePath: (path: string) => void;
    compile: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Default file path
    filePath: 'c:\\LaTeX\\diretrizes_pessoais.tex',
    code: `% Selecione ou digite o caminho do arquivo acima para começar.
\\documentclass{article}
\\begin{document}
Kousei - Editor Nativo
\\end{document}`,

    isCompiling: false,
    pdfUrl: null,
    diagnostics: [],

    setCode: (code) => set({ code }),
    setFilePath: (filePath) => set({ filePath }),

    compile: async () => {
        const { filePath, code } = get();
        if (!filePath) return;

        set({ isCompiling: true, diagnostics: [] });

        try {
            // 1. Save File Logic
            await writeTextFile(filePath, code);

            // 2. Prepare Path Logic
            // Split path into directory and filename for the Rust backend
            // Example: c:\LaTeX\file.tex -> dir: c:\LaTeX, file: file.tex
            // Basic Windows path parsing
            const lastSlash = filePath.lastIndexOf('\\');
            const projectPath = filePath.substring(0, lastSlash);
            const mainFile = filePath.substring(lastSlash + 1);

            console.log(`[Store] Saving to ${filePath} and Compiling...`);

            const result = await TauriBridge.compile(projectPath, mainFile);
            console.log('[AppStore] Compile Result:', result);

            if (result.success && result.pdf_path) {
                const assetUrl = convertFileSrc(result.pdf_path);
                const timestamp = new Date().getTime();
                console.log('[AppStore] Asset URL:', assetUrl);

                set({
                    pdfUrl: `${assetUrl}?t=${timestamp}`,
                    diagnostics: result.diagnostics
                });
            } else {
                console.error('[AppStore] Compilation Failed or No PDF:', result.logs);
                set({ diagnostics: result.diagnostics });
            }
        } catch (err) {
            console.error('[AppStore] FS/Compile Error:', err);
            set({ diagnostics: [{ line: 0, message: `System Error: ${err}`, severity: 'error' }] });
        }

        set({ isCompiling: false });
    }
}));
