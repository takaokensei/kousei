import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { LogParser, LogEntry } from '../utils/LogParser';

interface CompilationResult {
    success: boolean;
    pdfPath?: string;
    logs: string;
    diagnostics: LogEntry[];
}

export class CompilerService {
    private static isCompiling = false;

    /**
     * Compiles a LaTeX file using local xelatex.
     * Enforces a mutex to prevent parallel executions.
     */
    public static async compile(projectPath: string, mainFile: string): Promise<CompilationResult> {
        if (this.isCompiling) {
            throw new Error('Compilation already in progress. Please wait.');
        }

        this.isCompiling = true;

        return new Promise((resolve) => {
            const buildDir = path.join(projectPath, 'build');

            // Ensure build directory exists
            if (!fs.existsSync(buildDir)) {
                try {
                    fs.mkdirSync(buildDir, { recursive: true });
                } catch (e) {
                    this.isCompiling = false;
                    resolve({
                        success: false,
                        logs: `Failed to create build directory: ${e}`,
                        diagnostics: []
                    });
                    return;
                }
            }

            // Xelatex arguments
            // -interaction=nonstopmode: Don't pause on errors
            // -synctex=1: Enable synctex for reverse search
            // -output-directory=./build: Put files in build/ to keep root clean
            const args = [
                '-interaction=nonstopmode',
                '-synctex=1',
                '-output-directory=./build',
                mainFile
            ];

            const xelatexPath = 'C:\\Users\\Cauã V\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64\\xelatex.exe';
            console.log(`[Compiler] Spawning ${xelatexPath} in ${projectPath} with args:`, args.join(' '));

            const child = spawn(xelatexPath, args, {
                cwd: projectPath,
                shell: false // Windows compatibility
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('close', (code) => {
                this.isCompiling = false;

                const fullLog = stdout + '\n' + stderr;
                const diagnostics = LogParser.parse(fullLog);

                // Code 0 = Success, Code 1 = Error (but PDF might still exist if nonstopmode worked partially)
                // We verify if the PDF exists
                const pdfFilename = mainFile.replace(/\.tex$/i, '.pdf');
                const pdfFullPath = path.join(buildDir, pdfFilename);
                const pdfExists = fs.existsSync(pdfFullPath);

                resolve({
                    success: code === 0 || pdfExists, // Treat as success if PDF was generated, even with errors
                    pdfPath: pdfExists ? `/pdf/${pdfFilename}` : undefined,
                    logs: fullLog,
                    diagnostics: diagnostics
                });
            });

            child.on('error', (err) => {
                this.isCompiling = false;
                resolve({
                    success: false,
                    logs: `Failed to start compilation process: ${err.message}`,
                    diagnostics: []
                });
            });
        });
    }
}
