import React from 'react';
import { 
  MessageSquare, 
  Code2, 
  Bug, 
  Layers, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  FolderGit2,
  ChevronRight,
  X
} from 'lucide-react';
import { MinecraftVersion, SupportedPlatform } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  targetVersion: MinecraftVersion;
  targetPlatform: SupportedPlatform;
  onVersionChange: (version: MinecraftVersion) => void;
  onPlatformChange: (platform: SupportedPlatform) => void;
  filesCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  targetVersion,
  targetPlatform,
  filesCount,
  isOpen = false,
  onClose,
}) => {
  const navItems = [
    {
      id: 'chat',
      label: 'Rexa AI Studio',
      subtitle: 'Describe & Generate',
      icon: MessageSquare,
      badge: 'Active',
      color: 'text-purple-400',
    },
    {
      id: 'workspace',
      label: 'Plugin Workspace',
      subtitle: 'Code & File Tree',
      icon: Code2,
      badge: filesCount > 0 ? `${filesCount} Files` : undefined,
      color: 'text-indigo-400',
    },
    {
      id: 'analyzer',
      label: 'Error Analyzer & Fixer',
      subtitle: 'Log & Stacktrace Doctor',
      icon: Bug,
      badge: 'Auto-Fix',
      color: 'text-rose-400',
    },
    {
      id: 'versions',
      label: 'Platform & Versions',
      subtitle: 'Paper 26.2, Folia, Spigot',
      icon: Cpu,
      color: 'text-sky-400',
    },
    {
      id: 'export',
      label: 'JAR & ZIP Station',
      subtitle: 'Download Final Plugin',
      icon: Download,
      badge: 'Ready',
      color: 'text-emerald-400',
    },
    {
      id: 'blueprints',
      label: 'Plugin Blueprints',
      subtitle: 'Ready-to-Build Ideas',
      icon: Sparkles,
      color: 'text-amber-400',
    },
  ];

  const handleSelectTab = (tabId: string) => {
    onTabChange(tabId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Fixed slide-over drawer on mobile, static flex column on md+ */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 md:z-auto
          w-72 max-w-[85vw] md:w-64 lg:w-72
          border-r border-purple-500/20 
          bg-[#070210] md:bg-gradient-to-b md:from-[#080212] md:via-[#05010a] md:to-[#020005] 
          flex flex-col shrink-0 h-full md:h-[calc(100dvh-4rem)]
          p-4 select-none transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 shadow-purple-intense' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/15 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
            <span className="font-bold text-sm text-white">Rexa Navigation</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/50 text-slate-300 hover:text-white border border-purple-500/20 transition-colors"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Environment Card */}
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#130626]/80 to-purple-950/40 border border-purple-500/30 shadow-purple-glow shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Target Engine
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              26.2 Ready
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-lg bg-purple-900/50 text-white font-mono font-bold text-xs border border-purple-500/40">
              {targetPlatform.toUpperCase()}
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate">
              {targetVersion}
            </div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Adventure Component API</span>
            <span className="text-purple-300 font-mono">PDC / Java 21</span>
          </div>
        </div>

        {/* Navigation Links (Scrollable if needed on short screens) */}
        <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-purple-400/70 tracking-wider">
            Main Dashboard
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-left group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-purple-glow font-semibold'
                    : 'hover:bg-[#150828]/60 text-slate-300 hover:text-white border border-transparent hover:border-purple-500/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg transition-colors shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-purple-950/40 ' + item.color + ' group-hover:bg-purple-900/50'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">
                      {item.label}
                    </div>
                    <div className={`text-[11px] truncate ${isActive ? 'text-purple-100' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-black/30 text-white' 
                        : 'bg-purple-900/40 text-purple-300 border border-purple-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-white translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Status Box */}
        <div className="mt-auto pt-3 border-t border-purple-500/20 shrink-0">
          <div className="p-3 rounded-xl bg-[#0e041d] border border-purple-500/20 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Rexa AI Status
              </span>
              <span className="text-[10px] font-mono text-purple-400">v26.2-PRO</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Paper Adventure & Folia region checks with automatic JAR compilation.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
