import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as path from 'path';
import * as fs from 'fs';
import { CompilerService } from './services/CompilerService';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
app.post('/compile', async (req, res) => {
    const { projectPath, mainFile } = req.body;

    if (!projectPath || !mainFile) {
        return res.status(400).json({ error: 'Missing projectPath or mainFile' });
    }

    // Security check (basic): ensure projectPath exists
    if (!fs.existsSync(projectPath)) {
        return res.status(404).json({ error: 'Project path not found on server' });
    }

    try {
        const result = await CompilerService.compile(projectPath, mainFile);
        console.log('[Compiler Result]', JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error: any) {
        // Handle Mutex error or other crashes
        res.status(503).json({
            success: false,
            logs: error.message,
            diagnostics: []
        });
    }
});

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
    const projectPath = req.query.path as string;

    if (!projectPath) {
        return res.status(400).send('Missing path query param');
    }

    const filePath = path.join(projectPath, 'build', filename);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(filePath);
    } else {
        res.status(404).send('PDF not found');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`[LaTeX Studio Server] Running on http://localhost:${PORT}`);
    console.log(`[Config] Ready to compile in user workspaces.`);
});
