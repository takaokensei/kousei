import React from 'react';
import MonacoEditor, { type OnMount } from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';
import type * as Monaco from 'monaco-editor';

const EditorPanel: React.FC = () => {
    const { code, setCode, diagnostics } = useAppStore();
    const editorRef = React.useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = React.useRef<typeof Monaco | null>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

    // Sync diagnostics with Monaco (markers)
    React.useEffect(() => {
        if (monacoRef.current && editorRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
                const markers: Monaco.editor.IMarkerData[] = diagnostics.map(d => ({
                    startLineNumber: d.line || 1,
                    startColumn: 1,
                    endLineNumber: d.line || 1,
                    endColumn: 1000,
                    message: d.message,
                    severity: d.severity === 'error' ? monacoRef.current!.MarkerSeverity.Error : monacoRef.current!.MarkerSeverity.Warning
                }));
                monacoRef.current.editor.setModelMarkers(model, "owner", markers);
            }
        }
    }, [diagnostics]);

    return (
        <div className="h-full w-full bg-[#1a1b26] relative overflow-hidden">
            <MonacoEditor
                height="100%"
                width="100%"
                language="latex"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    fontFamily: 'JetBrains Mono',
                    padding: { top: 16 }
                }}
            />
        </div>
    );
};

export default EditorPanel;
