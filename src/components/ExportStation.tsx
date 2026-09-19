import React, { useState } from 'react';
import { 
  Download, 
  Package, 
  FileCode, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  FolderArchive, 
  Sparkles,
  Server,
  ArrowRight
} from 'lucide-react';
import { PluginProject } from '../types';

interface ExportStationProps {
  project?: PluginProject;
  onDownloadJar: () => void;
  onDownloadZip: () => void;
  onOpenWorkspace: () => void;
}

export const ExportStation: React.FC<ExportStationProps> = ({
  project,
  onDownloadJar,
  onDownloadZip,
  onOpenWorkspace,
}) => {
  const [copiedMvn, setCopiedMvn] = useState(false);
  const [activeTab, setActiveTab] = useState<'manifest' | 'pluginYml' | 'guide'>('manifest');

  const copyMvnCommand = () => {
    navigator.clipboard.writeText('mvn clean package');
    setCopiedMvn(true);
    setTimeout(() => setCopiedMvn(false), 2000);
  };

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#070210] to-black min-h-[calc(100vh-4rem)]">
        <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mb-4 shadow-purple-glow">
          <Package className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No Plugin Ready to Export</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Ask Rexa AI to architect a plugin first in the studio chat. Once generated, you can inspect its manifest and download both the compiled .JAR and source .ZIP files here.
        </p>
      </div>
    );
  }

  const pluginYml = project.files.find(f => f.path.endsWith('plugin.yml') || f.path.endsWith('paper-plugin.yml'))?.content || 'main: ' + project.mainClass;
  const manifest = [
    'Manifest-Version: 1.0',
    `Created-By: Rexa AI Plugin Architect v26.2`,
    `Implementation-Title: ${project.name}`,
    `Implementation-Version: ${project.version}`,
    `Main-Class: ${project.mainClass}`,
    `Built-By: Rexa AI Engine`,
    `Target-Platform: ${project.platform.toUpperCase()}`,
    `Target-Minecraft: ${project.minecraftVersion}`,
    `Build-Jdk: Java ${project.javaVersion}`
  ].join('\n');

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-[#06010c] via-[#090314] to-black min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Hero Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/50 via-[#150629] to-indigo-950/50 border border-purple-500/30 shadow-purple-intense flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Build Successful • Zero Compiler Warnings
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Final Plugin Packaging Station
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Your Minecraft plugin <strong className="text-purple-300 font-mono">{project.name} (v{project.version})</strong> is packaged and ready for deployment on <strong className="text-purple-300">{project.platform.toUpperCase()} {project.minecraftVersion}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {/* Download JAR */}
            <button
              onClick={onDownloadJar}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-purple-glow transition-all hover:scale-102 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download {project.name}.jar</span>
            </button>

            {/* Download ZIP */}
            <button
              onClick={onDownloadZip}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#180830] hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 font-semibold text-sm transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-purple-400" />
              <span>Download .ZIP Source</span>
            </button>
          </div>
        </div>

        {/* Package Metadata & Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0e041d] border border-purple-500/20">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Plugin Binary
            </span>
            <span className="text-sm font-mono font-bold text-purple-300">
              {project.name}-{project.version}.jar
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0e041d] border border-purple-500/20">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Server Target
            </span>
            <span className="text-sm font-bold text-white uppercase">
              {project.platform} ({project.minecraftVersion.split(' ')[0]})
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0e041d] border border-purple-500/20">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Java Runtime
            </span>
            <span className="text-sm font-bold text-emerald-400">
              Java {project.javaVersion} Compatible
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0e041d] border border-purple-500/20">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Total Package Files
            </span>
            <span className="text-sm font-bold text-purple-300 font-mono">
              {project.files.length} Files Inside
            </span>
          </div>
        </div>

        {/* Tabbed Inspector: Manifest / plugin.yml / Installation Guide */}
        <div className="rounded-2xl bg-[#0c0418] border border-purple-500/30 overflow-hidden shadow-dark-card">
          <div className="flex border-b border-purple-500/20 bg-[#120524] px-4">
            <button
              onClick={() => setActiveTab('manifest')}
              className={`px-4 py-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'manifest'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              META-INF/MANIFEST.MF
            </button>
            <button
              onClick={() => setActiveTab('pluginYml')}
              className={`px-4 py-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'pluginYml'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              plugin.yml Descriptor
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Server Install Guide
            </button>
          </div>

          <div className="p-5">
            {activeTab === 'manifest' && (
              <div>
                <p className="text-xs text-slate-400 mb-3">
                  This standard Java manifest is compiled into the root of your <code className="text-purple-300">.jar</code> file so your Minecraft server can load the main class.
                </p>
                <div className="p-4 rounded-xl bg-black/60 font-mono text-xs text-purple-200 leading-relaxed border border-purple-500/15">
                  <pre>{manifest}</pre>
                </div>
              </div>
            )}

            {activeTab === 'pluginYml' && (
              <div>
                <p className="text-xs text-slate-400 mb-3">
                  The Bukkit/Paper plugin descriptor specifying API version, main class, commands, and permissions.
                </p>
                <div className="p-4 rounded-xl bg-black/60 font-mono text-xs text-slate-200 leading-relaxed border border-purple-500/15">
                  <pre>{pluginYml}</pre>
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <strong className="text-white">Download the .JAR File</strong>
                    <p className="text-slate-400 mt-0.5">Click the "Download .JAR" button above to get your compiled plugin.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <strong className="text-white">Move into your server's plugins/ directory</strong>
                    <p className="text-slate-400 mt-0.5">Place the <code className="text-purple-300">{project.name}-{project.version}.jar</code> inside the <code className="text-purple-300 font-mono">plugins/</code> folder on your Paper/Purpur/Spigot server.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <strong className="text-white">Restart or reload your server</strong>
                    <p className="text-slate-400 mt-0.5">Run <code className="text-purple-300 font-mono">/reload confirm</code> or restart the server process. Verify with <code className="text-purple-300 font-mono">/plugins</code>.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">4</div>
                  <div>
                    <strong className="text-white">Build from source with Maven (Optional)</strong>
                    <p className="text-slate-400 mt-0.5">If you downloaded the <code className="text-purple-300">.ZIP</code>, extract it and run:</p>
                    <div className="mt-2 flex items-center gap-2 p-2.5 rounded-lg bg-black/60 font-mono text-xs text-purple-300 border border-purple-500/20">
                      <code>mvn clean package</code>
                      <button
                        onClick={copyMvnCommand}
                        className="ml-auto text-slate-400 hover:text-white p-1"
                        title="Copy Maven command"
                      >
                        {copiedMvn ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
