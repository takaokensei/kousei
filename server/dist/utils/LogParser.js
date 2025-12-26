"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogParser = void 0;
class LogParser {
    /**
     * Parses the raw LaTeX log output to extract meaningful errors and warnings.
     */
    static parse(logContent) {
        const entries = [];
        // Split log into lines for easier processing, although some errors span lines.
        // For a robust parser, we often look at the '!' marker.
        const lines = logContent.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Detect Error: usually starts with "! "
            // Example: ! Undefined control sequence.
            if (line.startsWith('! ')) {
                const message = line.substring(2).trim();
                let errorLine = 0;
                // The line number usually appears in the next few lines like "l.10 \timestamp"
                // We look ahead a few lines (max 5)
                for (let j = 1; j <= 5; j++) {
                    if (i + j >= lines.length)
                        break;
                    const nextLine = lines[i + j];
                    const lineMatch = nextLine.match(/^l\.(\d+)/);
                    if (lineMatch) {
                        errorLine = parseInt(lineMatch[1], 10);
                        break;
                    }
                }
                entries.push({
                    line: errorLine, // 0 if not found, meaning global error
                    message: message,
                    severity: 'error'
                });
            }
            // Detect Warning: usually "LaTeX Warning: ..."
            // Example: LaTeX Warning: Label(s) may have changed. Rerun...
            else if (line.includes('LaTeX Warning:')) {
                const message = line.trim();
                let warnLine = 0;
                // Sometimes warnings end with "on input line 10."
                const lineMatch = line.match(/on input line (\d+)\./);
                if (lineMatch) {
                    warnLine = parseInt(lineMatch[1], 10);
                }
                entries.push({
                    line: warnLine,
                    message: message,
                    severity: 'warning'
                });
            }
            // Checking for specialized package errors or font errors if needed
        }
        return entries;
    }
}
exports.LogParser = LogParser;
