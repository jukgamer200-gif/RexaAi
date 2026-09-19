import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Download, 
  Code2, 
  Terminal, 
  Package, 
  Bot, 
  User, 
  Cpu, 
  AlertCircle, 
  Check, 
  Copy, 
  Wrench,
  Loader2,
  FileText,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { ChatMessage, PluginProject, MinecraftVersion, SupportedPlatform } from '../types';
import { RexaGreeting } from './RexaGreeting';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  onOpenWorkspace: () => void;
  onDownloadJar: (project: PluginProject) => void;
  onDownloadZip: (project: PluginProject) => void;
  onApplyErrorFix: (fixedFiles: any[]) => void;
  targetVersion: MinecraftVersion;
  targetPlatform: SupportedPlatform;
  onOpenVersionModal: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  onOpenWorkspace,
  onDownloadJar,
  onDownloadZip,
  onApplyErrorFix,
  targetVersion,
  targetPlatform,
  onOpenVersionModal,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-4rem)] bg-gradient-to-b from-[#06010c] via-[#090314] to-[#020005] overflow-hidden relative">
      {/* Background glowing particles */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2.5 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Animated Greeting always visible at start or when messages are few */}
        {messages.length <= 1 && (
          <RexaGreeting
            onSelectPrompt={(prompt) => {
              setInput(prompt);
              textareaRef.current?.focus();
            }}
            targetVersion={targetVersion}
            targetPlatform={targetPlatform}
          />
        )}

        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const project = msg.pluginProject;
          const diagnosis = msg.errorDiagnosis;

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 sm:gap-4 max-w-4xl mx-auto ${
                isAssistant ? 'items-start' : 'items-start flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div className="shrink-0 mt-0.5 sm:mt-1">
                {isAssistant ? (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-900 p-0.5 shadow-purple-glow">
                    <div className="w-full h-full bg-[#0d031c] rounded-[10px] flex items-center justify-center">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 p-0.5">
                    <div className="w-full h-full bg-[#120626] rounded-[10px] flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
                    </div>
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className="flex-1 min-w-0 max-w-3xl">
                <div
                  className={`p-3.5 sm:p-5 rounded-2xl ${
                    isAssistant
                      ? 'bg-[#100620]/90 border border-purple-500/25 shadow-purple-glow text-slate-200'
                      : 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 text-white ml-auto'
                  }`}
                >
                  {/* Sender title */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-purple-500/15">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-wide">
                        {isAssistant ? (
                          <span className="bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent font-extrabold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            Rexa AI
                          </span>
                        ) : (
                          'You'
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <button
                      onClick={() => copyText(msg.id, msg.content)}
                      className="text-slate-400 hover:text-purple-300 transition-colors p-1 cursor-pointer"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Main text message */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans break-words">
                    {msg.content}
                  </div>

                  {/* Retry action for error messages */}
                  {(msg.id.includes('err') || msg.content.startsWith('⚠')) && isAssistant && (
                    <div className="mt-3 pt-2.5 border-t border-purple-500/20 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] text-purple-300/80 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Click below to retry generation with Rexa AI.
                      </span>
                      <button
                        onClick={() => {
                          const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                          if (lastUserMsg) {
                            onSendMessage(lastUserMsg.content);
                          }
                        }}
                        disabled={isGenerating}
                        className="px-3 py-1 rounded-lg bg-purple-700/80 hover:bg-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Plugin Project Card (If Assistant generated a plugin) */}
                  {project && (
                    <div className="mt-3.5 pt-3.5 border-t border-purple-500/25">
                      <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#17092c] to-[#0d041c] border border-purple-500/30 shadow-purple-glow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />
                              <h3 className="font-bold text-white text-sm sm:text-base truncate">
                                {project.name}
                              </h3>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono shrink-0">
                                Ready to Export
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1">
                              {project.description || `Custom plugin for Minecraft ${project.minecraftVersion}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-300 font-mono">
                              {project.platform.toUpperCase()} {project.minecraftVersion.split(' ')[0]}
                            </span>
                            <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg bg-black/40 text-slate-300 font-mono">
                              Java {project.javaVersion}
                            </span>
                          </div>
                        </div>

                        {/* File summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3.5 text-xs font-mono">
                          <div className="p-2 rounded-lg bg-black/40 border border-purple-500/15">
                            <span className="text-slate-400 block text-[10px]">CLASSES & FILES</span>
                            <span className="text-purple-300 font-bold">{project.files.length} Files</span>
                          </div>
                          <div className="p-2 rounded-lg bg-black/40 border border-purple-500/15">
                            <span className="text-slate-400 block text-[10px]">COMMANDS</span>
                            <span className="text-purple-300 font-bold">
                              {project.commands?.length || 1} Registered
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-black/40 border border-purple-500/15">
                            <span className="text-slate-400 block text-[10px]">PERMISSIONS</span>
                            <span className="text-purple-300 font-bold">
                              {project.permissions?.length || 1} Nodes
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-black/40 border border-purple-500/15">
                            <span className="text-slate-400 block text-[10px]">MAIN CLASS</span>
                            <span className="text-purple-300 truncate block" title={project.mainClass}>
                              {project.mainClass.split('.').pop()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => onDownloadJar(project)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-purple-glow transition-all hover:scale-[1.02] cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download {project.name}.jar</span>
                          </button>

                          <button
                            onClick={() => onDownloadZip(project)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#1d0a38] hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Package className="w-3.5 h-3.5 text-purple-400" />
                            <span>.ZIP Source</span>
                          </button>

                          <button
                            onClick={onOpenWorkspace}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 hover:bg-purple-950/40 border border-purple-500/20 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Inspect in Workspace</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Diagnosis Card (If Assistant analyzed an error) */}
                  {diagnosis && (
                    <div className="mt-4 pt-4 border-t border-rose-500/25">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/30 via-[#180515] to-purple-950/30 border border-rose-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-rose-400" />
                          <span className="font-bold text-rose-200 text-sm">
                            Diagnosis: {diagnosis.errorType}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-slate-300 mb-3">
                          <p><strong className="text-purple-300">Location:</strong> <code className="text-rose-300 bg-black/40 px-1.5 py-0.5 rounded">{diagnosis.culpritLocation}</code></p>
                          <p><strong className="text-purple-300">Root Cause:</strong> {diagnosis.rootCause}</p>
                          <p><strong className="text-purple-300">Solution:</strong> {diagnosis.solutionSummary}</p>
                        </div>

                        {diagnosis.fixedFiles && diagnosis.fixedFiles.length > 0 && (
                          <button
                            onClick={() => onApplyErrorFix(diagnosis.fixedFiles)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-purple-glow transition-all cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            Apply 1-Click Fix to Plugin ({diagnosis.fixedFiles.length} files)
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex gap-3 sm:gap-4 max-w-4xl mx-auto items-start">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 p-0.5 shadow-purple-glow">
              <div className="w-full h-full bg-[#0d031c] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-300 animate-pulse" />
              </div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#110622]/90 border border-purple-500/30 shadow-purple-glow text-slate-200 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <div>
                <div className="text-sm font-semibold text-purple-200">
                  Rexa AI is architecting your Minecraft plugin...
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Crafting Paper {targetVersion} code, plugin.yml, event listeners, and POM configuration
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 border-t border-purple-500/20 bg-[#070210]/95 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
          {/* Quick Version Tag & Helpers */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={onOpenVersionModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#140827] hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
            >
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>Engine: <strong className="uppercase">{targetPlatform}</strong> ({targetVersion})</span>
              <span className="text-[10px] text-purple-400 underline ml-1">Change</span>
            </button>

            <span className="text-slate-500 text-[11px] hidden sm:inline">
              Press <kbd className="px-1 py-0.5 rounded bg-purple-950/40 border border-purple-500/20 text-slate-400 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-purple-950/40 border border-purple-500/20 text-slate-400 font-mono text-[10px]">Shift+Enter</kbd> for newline
            </span>
          </div>

          {/* Text Input Container */}
          <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-[#0d041a] border border-purple-500/30 focus-within:border-purple-500 focus-within:shadow-purple-intense transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Describe your Minecraft plugin idea to Rexa AI (e.g., "Create a custom enchants plugin for Paper 26.2 with lightning strike and lifesteal")...`}
              rows={2}
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none px-3 py-1.5 focus:outline-none max-h-36 leading-relaxed"
            />

            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                input.trim() && !isGenerating
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-glow hover:scale-105'
                  : 'bg-purple-950/30 text-slate-600 cursor-not-allowed'
              }`}
              title="Generate with Rexa AI"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
