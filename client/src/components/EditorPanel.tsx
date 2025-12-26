import React, { useEffect, useRef } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';

const EditorPanel: React.FC = () => {
    const { code, setCode, diagnostics } = useAppStore();
    const monacoRef = useRef<Monaco | null>(null);
    const editorRef = useRef<any>(null);

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        monacoRef.current = monaco;
        editorRef.current = editor;
    };

    // Effect to update errors/warnings (diagnostics)
    useEffect(() => {
        if (monacoRef.current && editorRef.current && diagnostics.length > 0) {
            const model = editorRef.current.getModel();
            if (model) {
                const markers = diagnostics.map(d => ({
                    startLineNumber: d.line > 0 ? d.line : 1,
                    startColumn: 1,
                    endLineNumber: d.line > 0 ? d.line : 1,
                    endColumn: 1000,
                    message: d.message,
                    severity: d.severity === 'error'
                        ? monacoRef.current!.MarkerSeverity.Error
                        : monacoRef.current!.MarkerSeverity.Warning
                }));
                monacoRef.current.editor.setModelMarkers(model, 'owner', markers);
            }
        } else if (monacoRef.current && editorRef.current) {
            // Clear markers if no diagnostics
            const model = editorRef.current.getModel();
            if (model) monacoRef.current.editor.setModelMarkers(model, 'owner', []);
        }
    }, [diagnostics]);

    return (
        <div className="h-full w-full bg-bg font-sans">
            <Editor
                height="100%"
                defaultLanguage="latex"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, monospace',
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    padding: { top: 16 }
                }}
            />
        </div>
    );
};

export default EditorPanel;
