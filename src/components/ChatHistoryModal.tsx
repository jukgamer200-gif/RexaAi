import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Download, 
  Calendar, 
  Layers, 
  Check, 
  Sparkles,
  Edit2
} from 'lucide-react';
import { ChatSession } from '../types';

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAll: () => void;
}

export const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onClearAll,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const startEditing = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const saveEditing = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const exportSessionMarkdown = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    const content = [
      `# Chat Session: ${session.title}`,
      `Date: ${new Date(session.createdAt).toLocaleString()}`,
      `Target Engine: ${session.targetPlatform} (${session.targetVersion})`,
      '',
      '---',
      '',
      ...session.messages.map(m => `### ${m.role === 'user' ? 'User' : 'Rexa AI'}:\n${m.content}\n`)
    ].join('\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-[#0e061a] border border-purple-500/30 rounded-2xl shadow-purple-intense flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-black to-purple-950/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Saved Chat History
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-normal">
                    {sessions.length} Saved
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Manage your conversations and past plugin generation sessions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onNewSession();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-purple-glow transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Chat
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-purple-500/10 bg-black/40">
            <input
              type="text"
              placeholder="Search saved conversations..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#140824] border border-purple-500/20 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto text-purple-500/40 mb-3" />
                <p className="text-sm font-medium">No saved chat sessions found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Start a new conversation with Rexa AI to create your first plugin.
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isActive = session.id === activeSessionId;
                const messageCount = session.messages.length;
                const hasProject = !!session.currentProject;

                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                    className={`group p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isActive
                        ? 'bg-purple-950/40 border-purple-500/50 shadow-purple-glow'
                        : 'bg-[#120722]/50 hover:bg-[#190a30]/80 border-purple-500/15 hover:border-purple-500/35'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isActive ? 'bg-purple-600 text-white' : 'bg-purple-950/40 text-purple-400 group-hover:bg-purple-900/50'
                      }`}>
                        {hasProject ? <Layers className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        {editingId === session.id ? (
                          <form onSubmit={(e) => saveEditing(session.id, e)} className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="px-2 py-1 rounded bg-black border border-purple-500 text-xs text-white focus:outline-none w-full"
                              autoFocus
                            />
                            <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 truncate">
                              {session.title}
                            </span>
                            {isActive && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono">
                                Active
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            {new Date(session.updatedAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{messageCount} messages</span>
                          <span>•</span>
                          <span className="text-purple-400/90 font-mono text-[11px]">
                            {session.targetPlatform} {session.targetVersion.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startEditing(session, e)}
                        title="Rename Chat"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-900/30 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => exportSessionMarkdown(session, e)}
                        title="Export as Markdown"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-900/30 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete "${session.title}"?`)) {
                              onDeleteSession(session.id);
                            }
                          }}
                          title="Delete Chat"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-purple-500/20 bg-black/50 flex items-center justify-between text-xs text-slate-400">
            <span>Chats auto-saved locally</span>
            {sessions.length > 1 && (
              <button
                onClick={() => {
                  if (confirm('Clear all chat history? This cannot be undone.')) {
                    onClearAll();
                  }
                }}
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear All History
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
