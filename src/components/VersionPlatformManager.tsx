import React from 'react';
import { 
  Cpu, 
  Check, 
  Sparkles, 
  Layers, 
  Flame, 
  Zap, 
  Server, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MinecraftVersion, SupportedPlatform } from '../types';

interface VersionPlatformManagerProps {
  targetVersion: MinecraftVersion;
  targetPlatform: SupportedPlatform;
  onVersionSelect: (version: MinecraftVersion) => void;
  onPlatformSelect: (platform: SupportedPlatform) => void;
  onConfirm: () => void;
}

export const VersionPlatformManager: React.FC<VersionPlatformManagerProps> = ({
  targetVersion,
  targetPlatform,
  onVersionSelect,
  onPlatformSelect,
  onConfirm,
}) => {
  const platforms: Array<{
    id: SupportedPlatform;
    name: string;
    desc: string;
    badge: string;
    popular?: boolean;
  }> = [
    {
      id: 'paper',
      name: 'PaperMC',
      desc: 'Industry standard high-performance fork of Spigot with modern Adventure API & Paperweight.',
      badge: 'Recommended',
      popular: true,
    },
    {
      id: 'purpur',
      name: 'Purpur',
      desc: 'High-performance drop-in replacement for Paper with customizable gameplay mechanics and entities.',
      badge: 'Extended',
      popular: true,
    },
    {
      id: 'folia',
      name: 'Folia',
      desc: 'Next-generation PaperMC multithreading engine splitting worlds into independent regional thread pools.',
      badge: 'Multi-threaded',
      popular: true,
    },
    {
      id: 'spigot',
      name: 'Spigot',
      desc: 'Classic Bukkit-based server software. Stable, widely supported across legacy hosting.',
      badge: 'Classic',
    },
    {
      id: 'velocity',
      name: 'Velocity Proxy',
      desc: 'Next-generation Minecraft proxy with modern plugin API and high player concurrency.',
      badge: 'Proxy',
    },
    {
      id: 'bungeecord',
      name: 'BungeeCord',
      desc: 'Classic Minecraft proxy connecting multiple server networks.',
      badge: 'Proxy',
    },
    {
      id: 'fabric',
      name: 'Fabric Mod',
      desc: 'Lightweight, modular modding toolchain for server and client.',
      badge: 'Modding',
    }
  ];

  const versions: Array<{
    id: MinecraftVersion;
    label: string;
    java: string;
    tag: string;
    apiType: string;
    highlight?: boolean;
  }> = [
    {
      id: '26.2 (Next-Gen Paper)',
      label: '26.2 Next-Gen Paper',
      java: 'Java 21+',
      tag: 'Latest Experimental',
      apiType: 'Paperweight, Component MiniMessage, PDC, RegionScheduler',
      highlight: true,
    },
    {
      id: '1.21.4 (Latest Stable)',
      label: '1.21.4 (Latest Stable)',
      java: 'Java 21',
      tag: 'Tricky Trials / Bundles',
      apiType: 'Adventure Component, PDC, Custom Data Components',
      highlight: true,
    },
    {
      id: '1.21.1',
      label: '1.21.1',
      java: 'Java 21',
      tag: 'Trial Chambers',
      apiType: 'Adventure Component, PDC',
    },
    {
      id: '1.20.6',
      label: '1.20.6 / 1.20.5',
      java: 'Java 21',
      tag: 'Armadillo & Wolf Armor',
      apiType: 'Item Component Overhaul, Adventure',
    },
    {
      id: '1.20.4',
      label: '1.20.4',
      java: 'Java 17',
      tag: 'Trails & Tales',
      apiType: 'Adventure Component, NamespacedKey PDC',
    },
    {
      id: '1.19.4',
      label: '1.19.4',
      java: 'Java 17',
      tag: 'The Wild Update',
      apiType: 'Adventure API, Display Entities',
    },
    {
      id: '1.18.2',
      label: '1.18.2',
      java: 'Java 17',
      tag: 'Caves & Cliffs II',
      apiType: 'Extended World Height, Bukkit/Paper',
    },
    {
      id: '1.16.5',
      label: '1.16.5',
      java: 'Java 16/11/8',
      tag: 'Nether Update',
      apiType: 'Hex Color Codes, Netherite API',
    },
    {
      id: '1.12.2',
      label: '1.12.2',
      java: 'Java 8',
      tag: 'World of Color',
      apiType: 'Classic ID Names, Spigot ChatColor',
    },
    {
      id: '1.8.8',
      label: '1.8.8',
      java: 'Java 8',
      tag: 'Legacy PvP Standard',
      apiType: 'Legacy ChatColor, Old Combat Knockback',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-[#06010c] via-[#090314] to-black min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 via-[#150626] to-indigo-950/50 border border-purple-500/30 shadow-purple-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Universal Compatibility Engine
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Minecraft Version & Platform Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Rexa AI dynamically adapts its Java code generation, imports, event handlers, and POM dependencies to your chosen Minecraft version and server platform.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onConfirm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-purple-glow transition-all hover:scale-102 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Return to Chat</span>
            </button>
          </div>
        </div>

        {/* 1. Platform Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" />
                1. Select Server Platform
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose the Minecraft server software your plugin will target.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-300">
              Selected: <strong className="uppercase">{targetPlatform}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {platforms.map((p) => {
              const isSelected = targetPlatform === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => onPlatformSelect(p.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-400 shadow-purple-glow'
                      : 'bg-[#0f041e]/70 hover:bg-[#16062b] border-purple-500/15 hover:border-purple-500/35'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white flex items-center gap-1.5">
                      {p.name}
                      {p.popular && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                    }`}>
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Minecraft Version Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                2. Select Minecraft Version (From 26.2 Paper to Legacy 1.8.8)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Rexa AI will use appropriate APIs, Adventure Component serializers, and Java syntax for your version.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-300">
              Selected: <strong>{targetVersion}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {versions.map((v) => {
              const isSelected = targetVersion === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => onVersionSelect(v.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-purple-400 shadow-purple-glow'
                      : 'bg-[#0e041d]/70 hover:bg-[#16062d] border-purple-500/15 hover:border-purple-500/30'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">
                        {v.label}
                      </span>
                      {v.highlight && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-purple-300/80 font-medium">
                      {v.tag}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1 font-mono">
                      API: {v.apiType}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-black/50 text-slate-300 border border-purple-500/20">
                      {v.java}
                    </span>
                    {isSelected && (
                      <div className="mt-2 text-emerald-400 flex items-center justify-end gap-1 text-xs font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        Active
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Architecture Comparison */}
        <div className="p-6 rounded-2xl bg-[#0c0418] border border-purple-500/20 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Rexa AI Version Architecture Highlights:
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
            <li><strong className="text-purple-300">26.2 & 1.21.x Paper:</strong> Native Adventure Component API, MiniMessage gradients, PersistentDataContainer (PDC) NBT tag replacement, Java 21 virtual threads.</li>
            <li><strong className="text-purple-300">Folia:</strong> Thread-safe region scheduling (<code className="text-purple-200">entity.getScheduler().run()</code>), zero sync world calls from async threads.</li>
            <li><strong className="text-purple-300">Legacy (1.8 - 1.12):</strong> Backwards compatibility with <code className="text-purple-200">org.bukkit.ChatColor</code>, legacy Sound enum names, and legacy block data.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
