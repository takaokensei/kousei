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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const CompilerService_1 = require("./services/CompilerService");
const app = (0, express_1.default)();
const PORT = 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Routes
/**
 * Health Check
 */
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '2.0.0-PRO' });
});
/**
 * Trigger Compilation
 * Body: { projectPath: string, mainFile: string }
 */
app.post('/compile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectPath, mainFile } = req.body;
    if (!projectPath || !mainFile) {
        return res.status(400).json({ error: 'Missing projectPath or mainFile' });
    }
    // Security check (basic): ensure projectPath exists
    if (!fs.existsSync(projectPath)) {
        return res.status(404).json({ error: 'Project path not found on server' });
    }
    try {
        const result = yield CompilerService_1.CompilerService.compile(projectPath, mainFile);
        console.log('[Compiler Result]', JSON.stringify(result, null, 2));
        res.json(result);
    }
    catch (error) {
        // Handle Mutex error or other crashes
        res.status(503).json({
            success: false,
            logs: error.message,
            diagnostics: []
        });
    }
}));
/**
 * Serve Generated PDF
 * Example: /pdf/my_document.pdf?projectPath=...
 * Note: For V1, we assume a single project root or pass it via query param.
 * Better approach: The compile response returns a generic URL, and we map it here.
 * To keep it stateless, we'll try to find the file in the build/ folder of the PROJECT.
 *
 * Since we need to know WHICH project config the user is using,
 * we'll accept `projectPath` as a query parameter for now.
 * Usage: /pdf/arquivo.pdf?path=C:/LaTeX
 */
app.get('/pdf/:filename', (req, res) => {
    const filename = req.params.filename;
    const projectPath = req.query.path;
    if (!projectPath) {
        return res.status(400).send('Missing path query param');
    }
    const filePath = path.join(projectPath, 'build', filename);
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(filePath);
    }
    else {
        res.status(404).send('PDF not found');
    }
});
// Start Server
app.listen(PORT, () => {
    console.log(`[LaTeX Studio Server] Running on http://localhost:${PORT}`);
    console.log(`[Config] Ready to compile in user workspaces.`);
});
