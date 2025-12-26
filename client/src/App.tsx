import React, { useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/Header';

const App: React.FC = () => {
  const { loadFile, filePath } = useAppStore();

  useEffect(() => {
    // Initial load of the default file
    if (filePath) {
      loadFile(filePath);
    }
  }, []); // Run once on mount

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1a1b26] text-[#a9b1d6] overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <PanelGroup direction="horizontal" className="flex-1">
          <Panel defaultSize={50} minSize={20} className="flex flex-col">
            <EditorPanel />
          </Panel>

          <PanelResizeHandle className="w-1 bg-[#16161e] hover:bg-[#7aa2f7] transition-colors relative flex items-center justify-center group z-10">
            <div className="w-1 h-8 bg-gray-600 rounded-full group-hover:bg-[#7aa2f7]" />
          </PanelResizeHandle>

          <Panel defaultSize={50} minSize={20} className="flex flex-col">
            <PreviewPanel />
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}

export default App;
