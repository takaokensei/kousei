"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilerService = void 0;
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const LogParser_1 = require("../utils/LogParser");
class CompilerService {
    /**
     * Compiles a LaTeX file using local xelatex.
     * Enforces a mutex to prevent parallel executions.
     */
    static compile(projectPath, mainFile) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    }
                    catch (e) {
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
                const child = (0, child_process_1.spawn)(xelatexPath, args, {
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
                    const diagnostics = LogParser_1.LogParser.parse(fullLog);
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
        });
    }
}
exports.CompilerService = CompilerService;
CompilerService.isCompiling = false;
