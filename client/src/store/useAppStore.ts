import { create } from 'zustand';
import { TauriBridge, type Diagnostic } from '../services/TauriBridge';
import { convertFileSrc } from '@tauri-apps/api/core';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';

interface AppState {
    code: string;
    filePath: string;
    isCompiling: boolean;
    pdfUrl: string | null;
    diagnostics: Diagnostic[];
    setCode: (code: string) => void;
    setFilePath: (path: string) => void;
    loadFile: (path: string) => Promise<void>;
    compile: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Default file path
    filePath: 'c:\\LaTeX\\diretrizes_pessoais.tex',
    code: '', // Starts empty, will load on mount

    isCompiling: false,
    pdfUrl: null,
    diagnostics: [],

    setCode: (code) => set({ code }),
    setFilePath: (filePath) => set({ filePath }),

    loadFile: async (path) => {
        if (!path) return;
        try {
            console.log(`[Store] Reading file: ${path}`);
            const content = await readTextFile(path);
            set({ code: content });
        } catch (err) {
            console.error('[Store] Failed to read file:', err);
            set({ code: `% Failed to load file: ${path}\n% Error: ${err}\n% Please check path and permissions.` });
        }
    },

    compile: async () => {
        const { filePath, code } = get();
        if (!filePath) return;

        set({ isCompiling: true, diagnostics: [] });

        try {
            // 1. Save File Logic
            await writeTextFile(filePath, code);

            // 2. Prepare Path Logic
            const lastSlash = filePath.lastIndexOf('\\');
            const projectPath = filePath.substring(0, lastSlash);
            const mainFile = filePath.substring(lastSlash + 1);

            console.log(`[Store] Saving to ${filePath} and Compiling...`);

            const result = await TauriBridge.compile(projectPath, mainFile);
            console.log('[AppStore] Compile Result:', result);

            if (result.success && result.pdf_path) {
                const assetUrl = convertFileSrc(result.pdf_path);
                const timestamp = new Date().getTime();

                // Force update PDF preview logic
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
