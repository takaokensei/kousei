import { create } from 'zustand';
import { TauriBridge, type Diagnostic } from '../services/TauriBridge';
import { convertFileSrc } from '@tauri-apps/api/core';

interface AppState {
    code: string;
    isCompiling: boolean;
    pdfUrl: string | null;
    diagnostics: Diagnostic[];
    setCode: (code: string) => void;
    compile: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
    // Mantendo o "Sad Path" para teste inicial
    code: `% Teste de Erro (Sad Path)
\\documentclass{article}
\\begin{document}
  Testando compilação com erro.
  \\comandoinexistente % Este comando não existe!
\\end{document}`,

    isCompiling: false,
    pdfUrl: null,
    diagnostics: [],

    setCode: (code) => set({ code }),

    compile: async () => {
        set({ isCompiling: true, diagnostics: [] });

        // Hardcoded path for Alpha V1
        const projectPath = 'c:\\LaTeX';
        const mainFile = 'diretrizes_pessoais.tex';

        const result = await TauriBridge.compile(projectPath, mainFile);
        console.log('[AppStore] Compile Result:', result);

        if (result.success && result.pdf_path) {
            // Convert absolute local path to Tauri resource URL + cache busting
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

        set({ isCompiling: false });
    }
}));
