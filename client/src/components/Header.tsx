import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { KouseiLogo } from './KouseiLogo';
import { Play, FolderOpen } from 'lucide-react';
import clsx from 'clsx';
import { open } from '@tauri-apps/plugin-dialog';

export const Header: React.FC = () => {
    const { isCompiling, compile, filePath, setFilePath, loadFile } = useAppStore();

    const handleFileSelect = async () => {
        try {
            const selected = await open({
                multiple: false,
                filters: [{
                    name: 'LaTeX',
                    extensions: ['tex']
                }]
            });

            if (selected && typeof selected === 'string') {
                setFilePath(selected);
                loadFile(selected);
            }
        } catch (err) {
            console.error("Failed to open file dialog", err);
        }
    };

    return (
        <header data-tauri-drag-region className="h-14 px-4 flex items-center justify-between border-b border-[#7aa2f7]/20 bg-[#1a1b26]/50 backdrop-blur-md flex-shrink-0 z-50">
            {/* Left: Branding */}
            <div className="flex items-center gap-4 pointer-events-none select-none">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <div className="flex items-center gap-3">
                    <KouseiLogo size={32} className="drop-shadow-lg" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7] font-sans">
                        Kousei
                    </h1>
                </div>
            </div>

            {/* Center: File Path */}
            <div className="flex-1 flex items-center justify-center max-w-2xl mx-8 gap-2">
                <div className="relative flex-1 group">
                    <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-accent-blue transition-colors" />
                    <input
                        type="text"
                        value={filePath}
                        onChange={(e) => setFilePath(e.target.value)}
                        onBlur={() => loadFile(filePath)} // Load on blur if manually typed
                        className="w-full h-9 pl-10 pr-4 rounded-lg bg-[#16161e]/80 border border-[#24283b] group-hover:border-accent-blue/50 text-xs text-[#a9b1d6] focus:outline-none focus:border-accent-blue font-mono transition-all"
                        placeholder="Select or type a .tex file path..."
                    />
                </div>
                <button
                    onClick={handleFileSelect}
                    className="p-2 rounded-lg bg-[#24283b] hover:bg-[#3b4261] text-[#7aa2f7] transition-colors"
                    title="Open File"
                >
                    <FolderOpen size={16} />
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => compile()}
                    disabled={isCompiling}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg",
                        "bg-[#7aa2f7] text-[#1a1b26] hover:bg-[#bb9af7] hover:scale-105 active:scale-95",
                        isCompiling && "opacity-50 cursor-not-allowed grayscale"
                    )}
                >
                    {isCompiling ? (
                        <div className="w-4 h-4 border-2 border-[#1a1b26] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Play className="w-4 h-4 fill-current" />
                    )}
                    {isCompiling ? 'Compiling' : 'Compile'}
                </button>
            </div>
        </header>
    );
};
