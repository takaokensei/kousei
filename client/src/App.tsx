import React, { useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import { useAppStore } from './store/useAppStore';
import { Play } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const { compile, isCompiling, setCode } = useAppStore();

  // Load initial code (simulation of loading a file)
  // Ideally this would come from an API reading the file
  useEffect(() => {
    // For demo purposes, we are just keeping the default 'Hello World' in store or the user can paste
    // In a real app, we would fetch file content here.
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-bg text-text overflow-hidden">
      {/* Header / Toolbar */}
      <header className="h-14 glass flex items-center justify-between px-4 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 font-bold text-lg text-white font-mono tracking-tight">Kousei <span className="text-accent-blue font-normal text-xs align-top">v1.0</span></span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => compile()}
            disabled={isCompiling}
            className={clsx(
              "flex items-center gap-2 px-4 py-1.5 rounded-md font-medium text-sm transition-all",
              "bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 border border-accent-blue/20",
              isCompiling && "opacity-50 cursor-not-allowed"
            )}
          >
            <Play className="w-4 h-4 fill-current" />
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 relative">
        <PanelGroup direction="horizontal">

          {/* Editor Area */}
          <Panel defaultSize={50} minSize={20}>
            <EditorPanel />
          </Panel>

          <PanelResizeHandle className="w-1 bg-[#16161e] hover:bg-accent-blue transition-colors" />

          {/* Preview Area */}
          <Panel defaultSize={50} minSize={20}>
            <PreviewPanel />
          </Panel>

        </PanelGroup>
      </main>

      {/* Status Bar (Optional) */}
      <footer className="h-6 bg-[#16161e] border-t border-[#24283b] flex items-center px-4 text-xs text-slate-500">
        <span>Ready</span>
        <span className="mx-2">•</span>
        <span>UTF-8</span>
        <span className="mx-2">•</span>
        <span>Latex Mode</span>
      </footer>
    </div>
  );
}

export default App;
