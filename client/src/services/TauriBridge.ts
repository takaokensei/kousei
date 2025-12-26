import { invoke } from '@tauri-apps/api/core';

export interface Diagnostic {
    line: number;
    message: string;
    severity: 'error' | 'warning';
}

export interface CompileResult {
    success: boolean;
    pdf_path: string | null;
    diagnostics: Diagnostic[];
    logs: string;
}

export const TauriBridge = {
    compile: async (projectPath: string, mainFile: string): Promise<CompileResult> => {
        try {
            const result = await invoke<CompileResult>('compile_latex', {
                projectPath,
                mainFile
            });
            return result;
        } catch (error) {
            console.error('Tauri Invocation Error:', error);
            return {
                success: false,
                pdf_path: null,
                diagnostics: [{ line: 0, message: String(error), severity: 'error' }],
                logs: String(error)
            };
        }
    }
};
