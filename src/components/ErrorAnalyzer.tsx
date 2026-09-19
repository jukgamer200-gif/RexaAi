import React, { useState } from 'react';
import { 
  Bug, 
  Wrench, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  ArrowRight, 
  Loader2, 
  Copy, 
  Check, 
  Terminal,
  RotateCcw
} from 'lucide-react';
import { SAMPLE_ERROR_STACKTRACES } from '../data/templates';
import { ErrorDiagnosis, PluginFile, MinecraftVersion, SupportedPlatform } from '../types';

interface ErrorAnalyzerProps {
  onDiagnose: (errorLog: string) => Promise<ErrorDiagnosis | null>;
  onApplyFix: (fixedFiles: PluginFile[]) => void;
  existingFiles: PluginFile[];
  targetVersion: MinecraftVersion;
  targetPlatform: SupportedPlatform;
}

export const ErrorAnalyzer: React.FC<ErrorAnalyzerProps> = ({
  onDiagnose,
  onApplyFix,
  existingFiles,
  targetVersion,
  targetPlatform,
}) => {
  const [errorLog, setErrorLog] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<ErrorDiagnosis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);

  const handleSampleSelect = (sample: typeof SAMPLE_ERROR_STACKTRACES[0]) => {
    setErrorLog(sample.log);
    setDiagnosis(null);
    setErrorMessage(null);
    setFixApplied(false);
  };

  const handleRunAnalysis = async () => {
    if (!errorLog.trim()) return;
    setIsAnalyzing(true);
    setDiagnosis(null);
    setErrorMessage(null);
    setFixApplied(false);
    try {
      const result = await onDiagnose(errorLog);
      if (result) {
        setDiagnosis(result);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Diagnostic failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (diagnosis && diagnosis.fixedFiles?.length > 0) {
      onApplyFix(diagnosis.fixedFiles);
      setFixApplied(true);
      setTimeout(() => setFixApplied(false), 3000);
    }
  };

  const activeFixedFile = diagnosis?.fixedFiles?.[selectedFileIdx];

  const handleCopyCode = () => {
    if (activeFixedFile) {
      navigator.clipboard.writeText(activeFixedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-[#06010c] via-[#090314] to-black min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#160621]/80 to-purple-950/40 border border-rose-500/30 shadow-purple-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-purple-800 p-0.5 shadow-purple-glow shrink-0">
              <div className="w-full h-full bg-[#0d0217] rounded-[10px] flex items-center justify-center">
                <Bug className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Rexa AI Error Analyzer & Fixer
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-medium">
                  Auto-Patch Engine
                </span>
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Paste your Minecraft server console log, stack trace, or compiler error. Rexa AI will pinpoint the culprit line and generate the exact fix.
              </p>
            </div>
          </div>

          <div className="text-xs px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-purple-300 font-mono shrink-0">
            Target: {targetPlatform.toUpperCase()} ({targetVersion})
          </div>
        </div>

        {/* Preset Samples */}
        <div className="p-4 rounded-xl bg-[#0c0419] border border-purple-500/20">
          <span className="text-xs font-bold uppercase text-purple-400 tracking-wider block mb-2">
            Try Sample Minecraft Errors:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_ERROR_STACKTRACES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleSelect(sample)}
                className="px-3 py-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-900/60 border border-purple-500/20 text-xs text-purple-200 hover:text-white transition-colors cursor-pointer text-left"
              >
                <span className="font-semibold">{sample.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Log Area */}
        <div className="p-5 rounded-2xl bg-[#0e041d] border border-purple-500/30 space-y-3 shadow-dark-card">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              Server Console Error Log / Stack Trace
            </label>
            {errorLog && (
              <button
                onClick={() => setErrorLog('')}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <textarea
            rows={7}
            value={errorLog}
            onChange={(e) => setErrorLog(e.target.value)}
            placeholder={`Paste your error stack trace here, e.g.:\n[12:00:00 ERROR]: Could not pass event PlayerInteractEvent to MyPlugin...\nCaused by: java.lang.NullPointerException...`}
            className="w-full p-3.5 rounded-xl bg-black/60 border border-purple-500/20 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-y leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleRunAnalysis}
              disabled={!errorLog.trim() || isAnalyzing}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-purple-glow cursor-pointer ${
                errorLog.trim() && !isAnalyzing
                  ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white hover:scale-[1.02]'
                  : 'bg-purple-950/40 text-slate-500 cursor-not-allowed border border-purple-500/10'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rexa AI is diagnosing error...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>Analyze & Fix with Rexa AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={handleRunAnalysis}
              className="px-3 py-1 rounded-lg bg-rose-800/60 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
            >
              Retry Diagnosis
            </button>
          </div>
        )}

        {/* Diagnosis Results */}
        {diagnosis && (
          <div className="space-y-6 pt-2">
            {/* Diagnosis Overview Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#180727] via-[#10041f] to-black border border-purple-500/30 shadow-purple-intense space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-wider">
                      Identified Exception
                    </span>
                    <h2 className="text-lg font-bold text-white">
                      {diagnosis.errorType}
                    </h2>
                  </div>
                </div>

                <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-black/50 border border-purple-500/30 text-rose-300">
                  Culprit: {diagnosis.culpritLocation}
                </div>
              </div>

              {/* Diagnosis Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-black/40 border border-purple-500/15">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                    Root Cause
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {diagnosis.rootCause}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-purple-500/15">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Rexa AI Solution
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {diagnosis.solutionSummary}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed pt-1">
                <strong className="text-purple-300">Deep Explanation:</strong> {diagnosis.explanation}
              </div>
            </div>

            {/* Fixed Files Preview & 1-Click Patch */}
            {diagnosis.fixedFiles && diagnosis.fixedFiles.length > 0 && (
              <div className="rounded-2xl bg-[#0b0318] border border-purple-500/30 overflow-hidden shadow-purple-glow">
                <div className="p-4 border-b border-purple-500/20 bg-[#120524] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Rexa Patched Source Files ({diagnosis.fixedFiles.length})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Review the corrected code below and apply it directly to your workspace.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/70 border border-purple-500/30 text-purple-300 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Patched Code'}</span>
                    </button>

                    <button
                      onClick={handleApply}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold shadow-purple-glow transition-all cursor-pointer ${
                        fixApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                      }`}
                    >
                      {fixApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied to Workspace!</span>
                        </>
                      ) : (
                        <>
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Apply 1-Click Patch</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* File tab switcher if multiple files */}
                {diagnosis.fixedFiles.length > 1 && (
                  <div className="flex gap-2 p-2 border-b border-purple-500/15 bg-black/40 overflow-x-auto">
                    {diagnosis.fixedFiles.map((f, idx) => (
                      <button
                        key={f.path}
                        onClick={() => setSelectedFileIdx(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          selectedFileIdx === idx
                            ? 'bg-purple-600 text-white font-semibold'
                            : 'bg-purple-950/40 text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.path.split('/').pop()}
                      </button>
                    ))}
                  </div>
                )}

                {/* Code Preview */}
                {activeFixedFile && (
                  <div className="p-4 bg-[#05010a] font-mono text-xs max-h-96 overflow-auto leading-relaxed">
                    <div className="text-[11px] text-purple-400 mb-2 font-bold">
                      {activeFixedFile.path}
                    </div>
                    <pre className="text-slate-200">
                      <code>{activeFixedFile.content}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
