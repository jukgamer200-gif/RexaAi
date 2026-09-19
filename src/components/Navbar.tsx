import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  MoreVertical, 
  Code2, 
  Package, 
  Plus, 
  History, 
  FileCode, 
  Trash2, 
  Check, 
  Share2,
  Cpu,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { PluginProject, MinecraftVersion, SupportedPlatform } from '../types';

interface NavbarProps {
  currentProject?: PluginProject;
  targetVersion: MinecraftVersion;
  targetPlatform: SupportedPlatform;
  onOpenHistory: () => void;
  onNewChat: () => void;
  onDownloadJar: () => void;
  onDownloadZip: () => void;
  onSwitchTab: (tab: string) => void;
  activeTab: string;
  isGenerating: boolean;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  targetVersion,
  targetPlatform,
  onOpenHistory,
  onNewChat,
  onDownloadJar,
  onDownloadZip,
  onSwitchTab,
  activeTab,
  isGenerating,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 border-b border-purple-500/20 bg-[#07020f]/95 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {/* Mobile Hamburger Toggle Button */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 md:hidden transition-colors cursor-pointer shrink-0"
            aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        )}

        <div 
          onClick={() => onSwitchTab('chat')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-950 p-0.5 shadow-purple-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d041a] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-[#07020f]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent truncate">
                Rexa AI
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/40 text-purple-300 shadow-purple-glow shrink-0">
                26.2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden lg:block truncate">
              Minecraft Super-Tier Plugin Maker & Error Fixer
            </p>
          </div>
        </div>

        {/* Current Active Engine Badge */}
        <div className="hidden xl:flex items-center gap-2 ml-4 pl-4 border-l border-purple-500/20">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#140827] border border-purple-500/30 text-xs text-purple-300">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold uppercase">{targetPlatform}</span>
            <span className="text-slate-400 font-mono">{targetVersion.split(' ')[0]}</span>
          </div>

          {currentProject && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-semibold">{currentProject.name}</span>
              <span className="text-emerald-400/70">v{currentProject.version}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Workspace Code Toggle */}
        <button
          onClick={() => onSwitchTab('workspace')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            activeTab === 'workspace'
              ? 'bg-purple-600 text-white border-purple-400 shadow-purple-glow'
              : 'bg-[#140826] hover:bg-purple-950/50 text-slate-200 border-purple-500/20 hover:border-purple-500/40'
          }`}
          title="Open Plugin Code Workspace"
        >
          <Code2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="hidden sm:inline">Workspace</span>
          {currentProject && (
            <span className="px-1.5 py-0.2 rounded bg-purple-900/60 text-[10px] font-mono text-purple-300">
              {currentProject.files.length}
            </span>
          )}
        </button>

        {/* Instant Download JAR Button */}
        <button
          onClick={onDownloadJar}
          disabled={!currentProject || isGenerating}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-purple-glow cursor-pointer ${
            currentProject && !isGenerating
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/40 hover:scale-[1.02]'
              : 'bg-purple-950/30 text-slate-500 border border-purple-500/10 cursor-not-allowed'
          }`}
          title="Download compiled .JAR plugin for your Minecraft server"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Download</span>
          <span>.JAR</span>
        </button>

        {/* Download ZIP Button */}
        <button
          onClick={onDownloadZip}
          disabled={!currentProject || isGenerating}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            currentProject && !isGenerating
              ? 'bg-[#150929] hover:bg-purple-900/40 text-purple-200 border-purple-500/30 hover:border-purple-500/50'
              : 'bg-purple-950/20 text-slate-600 border-purple-500/10 cursor-not-allowed'
          }`}
          title="Download Maven Source Code (.ZIP)"
        >
          <Package className="w-3.5 h-3.5 text-purple-400" />
          <span>.ZIP</span>
        </button>

        {/* RIGHT SIDE 3-DOT MENU BUTTON (Explicit User Requirement) */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              menuOpen 
                ? 'bg-purple-600 text-white border-purple-400 shadow-purple-glow' 
                : 'bg-[#140826] hover:bg-purple-900/30 text-slate-300 border-purple-500/20 hover:border-purple-500/40'
            }`}
            title="Chat History & Options"
            aria-label="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* 3-Dot Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e051b] border border-purple-500/30 shadow-purple-intense py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-purple-500/15 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Chat & Project Management
                </span>
              </div>

              {/* Chat History Option */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenHistory();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-slate-200 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-purple-900/50 text-purple-300">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100">Saved Chat History</div>
                  <div className="text-[11px] text-slate-400">View and restore past sessions</div>
                </div>
              </button>

              {/* New Chat Option */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onNewChat();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-slate-200 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-indigo-900/50 text-indigo-300">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100">New Plugin Chat</div>
                  <div className="text-[11px] text-slate-400">Start fresh session with Rexa AI</div>
                </div>
              </button>

              {/* View Workspace / Files */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onSwitchTab('workspace');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-slate-200 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-purple-900/50 text-purple-300">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100">Plugin Code Workspace</div>
                  <div className="text-[11px] text-slate-400">Inspect Java & config files</div>
                </div>
              </button>

              {/* Error Analyzer */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onSwitchTab('analyzer');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-slate-200 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-purple-900/50 text-purple-300">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100">Error Analyzer & Fixer</div>
                  <div className="text-[11px] text-slate-400">Debug crash logs & stack traces</div>
                </div>
              </button>

              <div className="my-1.5 border-t border-purple-500/15" />

              {/* Share App Link */}
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-purple-900/30 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-400" />}
                <span>{copied ? 'Copied Link!' : 'Share Rexa AI App'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
