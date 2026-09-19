import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { PluginWorkspace } from './components/PluginWorkspace';
import { ErrorAnalyzer } from './components/ErrorAnalyzer';
import { VersionPlatformManager } from './components/VersionPlatformManager';
import { ExportStation } from './components/ExportStation';
import { BlueprintsGallery } from './components/BlueprintsGallery';
import { ChatHistoryModal } from './components/ChatHistoryModal';
import { INITIAL_PROJECT } from './data/initialProject';
import { 
  ChatMessage, 
  ChatSession, 
  PluginProject, 
  PluginFile, 
  ErrorDiagnosis, 
  MinecraftVersion, 
  SupportedPlatform,
  BlueprintTemplate 
} from './types';
import { downloadPluginJar, downloadPluginZip } from './utils/exporter';

const SESSIONS_STORAGE_KEY = 'rexa_minecraft_plugin_sessions_v1';

export default function App() {
  const [targetVersion, setTargetVersion] = useState<MinecraftVersion>('26.2 (Next-Gen Paper)');
  const [targetPlatform, setTargetPlatform] = useState<SupportedPlatform>('paper');
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Initialize or load sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved sessions from localStorage:', e);
    }

    // Default initial session
    const initialSession: ChatSession = {
      id: 'session-rexa-init',
      title: 'MysticEnchants 26.2',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      targetVersion: '26.2 (Next-Gen Paper)',
      targetPlatform: 'paper',
      currentProject: INITIAL_PROJECT,
      messages: [
        {
          id: 'msg-init-1',
          role: 'assistant',
          content: `Hi Iam Rexa ai How can I help you :))\n\nI have pre-architected **MysticEnchants v1.0.0** for **Paper 26.2** as an initial showcase. It features Lightning strike combat, Lifesteal, and Telepathy mining with Adventure MiniMessage and PersistentDataContainer keys!\n\nYou can describe any plugin you want to build next, paste a server crash log to analyze and fix, or download the compiled .JAR file right now.`,
          timestamp: Date.now(),
          pluginProject: INITIAL_PROJECT,
        }
      ]
    };
    return [initialSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-rexa-init';
  });

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const currentProject = activeSession?.currentProject || INITIAL_PROJECT;

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage:', e);
    }
  }, [sessions]);

  // Update session project
  const updateActiveSessionProject = (project: PluginProject) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          currentProject: project,
          updatedAt: Date.now()
        };
      }
      return s;
    }));
  };

  // Send message to Rexa AI API
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    // Add user message immediately
    const updatedMessages = [...(activeSession.messages || []), userMessage];
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: updatedMessages,
          updatedAt: Date.now(),
          title: s.messages.length <= 1 ? text.slice(0, 30) + '...' : s.title,
        };
      }
      return s;
    }));

    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          targetVersion,
          targetPlatform,
          existingProject: currentProject,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.reply || "I've created your Minecraft plugin code! You can review the files in the workspace or download the .JAR and .ZIP files.",
        timestamp: Date.now(),
        pluginProject: data.pluginProject,
        errorDiagnosis: data.diagnosis,
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          const newMessages = [...s.messages, assistantMessage];
          return {
            ...s,
            messages: newMessages,
            currentProject: data.pluginProject || s.currentProject,
            updatedAt: Date.now(),
          };
        }
        return s;
      }));
    } catch (error: any) {
      console.error('Rexa AI Chat Error:', error);
      let formattedMsg = error.message || 'Please check your connection and try again.';
      try {
        if (formattedMsg.startsWith('{') && formattedMsg.endsWith('}')) {
          const parsed = JSON.parse(formattedMsg);
          if (parsed.error && parsed.error.message) {
            formattedMsg = parsed.error.message;
          }
        }
      } catch {}

      if (formattedMsg.includes('503') || formattedMsg.includes('high demand') || formattedMsg.includes('UNAVAILABLE')) {
        formattedMsg = 'The AI model experienced temporary high demand. Rexa AI has activated fallback routing. Please click "Try Again" below.';
      }

      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: `⚠ Rexa AI Service Note: ${formattedMsg}`,
        timestamp: Date.now(),
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, errorMessage],
            updatedAt: Date.now(),
          };
        }
        return s;
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Diagnose Error endpoint
  const handleDiagnoseError = async (errorLog: string): Promise<ErrorDiagnosis | null> => {
    try {
      const response = await fetch('/api/analyze-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorLog,
          targetVersion,
          targetPlatform,
          existingFiles: currentProject?.files || [],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to diagnose error');
      }

      const data = await response.json();
      return data.diagnosis || null;
    } catch (error: any) {
      console.error('Diagnose Error:', error);
      let errMsg = error.message || 'Error diagnosis failed';
      try {
        if (errMsg.startsWith('{') && errMsg.endsWith('}')) {
          const parsed = JSON.parse(errMsg);
          if (parsed.error && parsed.error.message) errMsg = parsed.error.message;
        }
      } catch {}
      if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE')) {
        errMsg = 'The AI diagnostic engine is experiencing high demand. Please try again in a few seconds.';
      }
      throw new Error(errMsg);
    }
  };

  // Apply Error Fix to Workspace
  const handleApplyErrorFix = (fixedFiles: PluginFile[]) => {
    if (!currentProject || !fixedFiles) return;

    const newFiles = [...currentProject.files];
    for (const fixed of fixedFiles) {
      const idx = newFiles.findIndex(f => f.path === fixed.path || f.path.endsWith(fixed.path.split('/').pop() || ''));
      if (idx !== -1) {
        newFiles[idx] = { ...newFiles[idx], content: fixed.content, isModified: true };
      } else {
        newFiles.push(fixed);
      }
    }

    const updatedProject: PluginProject = {
      ...currentProject,
      files: newFiles,
      lastGeneratedAt: new Date().toISOString(),
    };

    updateActiveSessionProject(updatedProject);
    setActiveTab('workspace');
  };

  // Workspace file modifications
  const handleUpdateFile = (path: string, newContent: string) => {
    if (!currentProject) return;
    const updatedFiles = currentProject.files.map(f => 
      f.path === path ? { ...f, content: newContent, isModified: true } : f
    );
    updateActiveSessionProject({ ...currentProject, files: updatedFiles });
  };

  const handleAddFile = (file: PluginFile) => {
    if (!currentProject) return;
    updateActiveSessionProject({
      ...currentProject,
      files: [...currentProject.files, file],
    });
  };

  const handleDeleteFile = (path: string) => {
    if (!currentProject) return;
    updateActiveSessionProject({
      ...currentProject,
      files: currentProject.files.filter(f => f.path !== path),
    });
  };

  // Downloads
  const handleDownloadJar = async (projectToDownload?: PluginProject) => {
    const proj = projectToDownload || currentProject;
    if (proj) {
      await downloadPluginJar(proj);
    }
  };

  const handleDownloadZip = async (projectToDownload?: PluginProject) => {
    const proj = projectToDownload || currentProject;
    if (proj) {
      await downloadPluginZip(proj);
    }
  };

  // Session management (3-dot menu)
  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Plugin Project',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      targetVersion,
      targetPlatform,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: 'Hi Iam Rexa ai How can I help you :))\n\nTell me what Minecraft plugin you want to create! I can build Paper 26.2 custom items, Folia region teleporters, Vault economy shops, custom mobs, and more.',
          timestamp: Date.now(),
        }
      ]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setActiveTab('chat');
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        handleNewChat();
        return prev;
      }
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleClearAllHistory = () => {
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
    handleNewChat();
  };

  const handleSelectBlueprint = (blueprint: BlueprintTemplate) => {
    setTargetVersion(blueprint.version);
    setTargetPlatform(blueprint.platform);
    setActiveTab('chat');
    handleSendMessage(blueprint.prompt);
  };

  return (
    <div className="min-h-screen bg-[#05010a] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Navbar with Branding, Actions & 3-Dot Menu */}
      <Navbar
        currentProject={currentProject}
        targetVersion={targetVersion}
        targetPlatform={targetPlatform}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onNewChat={handleNewChat}
        onDownloadJar={() => handleDownloadJar()}
        onDownloadZip={() => handleDownloadZip()}
        onSwitchTab={(tab) => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        activeTab={activeTab}
        isGenerating={isGenerating}
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        isSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Layout (Sidebar + Active View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dark Purple Gradient Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          targetVersion={targetVersion}
          targetPlatform={targetPlatform}
          onVersionChange={setTargetVersion}
          onPlatformChange={setTargetPlatform}
          filesCount={currentProject?.files.length || 0}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* View Switcher */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'chat' && (
            <ChatInterface
              messages={activeSession?.messages || []}
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              onOpenWorkspace={() => setActiveTab('workspace')}
              onDownloadJar={handleDownloadJar}
              onDownloadZip={handleDownloadZip}
              onApplyErrorFix={handleApplyErrorFix}
              targetVersion={targetVersion}
              targetPlatform={targetPlatform}
              onOpenVersionModal={() => setActiveTab('versions')}
            />
          )}

          {activeTab === 'workspace' && (
            <PluginWorkspace
              project={currentProject}
              onUpdateFile={handleUpdateFile}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
              onDownloadJar={() => handleDownloadJar()}
              onDownloadZip={() => handleDownloadZip()}
              onAskRexaToFix={(snippet) => {
                setActiveTab('chat');
                handleSendMessage(`Please inspect and optimize this code:\n${snippet}`);
              }}
            />
          )}

          {activeTab === 'analyzer' && (
            <ErrorAnalyzer
              onDiagnose={handleDiagnoseError}
              onApplyFix={handleApplyErrorFix}
              existingFiles={currentProject?.files || []}
              targetVersion={targetVersion}
              targetPlatform={targetPlatform}
            />
          )}

          {activeTab === 'versions' && (
            <VersionPlatformManager
              targetVersion={targetVersion}
              targetPlatform={targetPlatform}
              onVersionSelect={setTargetVersion}
              onPlatformSelect={setTargetPlatform}
              onConfirm={() => setActiveTab('chat')}
            />
          )}

          {activeTab === 'export' && (
            <ExportStation
              project={currentProject}
              onDownloadJar={() => handleDownloadJar()}
              onDownloadZip={() => handleDownloadZip()}
              onOpenWorkspace={() => setActiveTab('workspace')}
            />
          )}

          {activeTab === 'blueprints' && (
            <BlueprintsGallery
              onSelectBlueprint={handleSelectBlueprint}
            />
          )}
        </main>
      </div>

      {/* 3-Dot Menu: Saved Chat History Modal */}
      <ChatHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setActiveTab('chat');
        }}
        onNewSession={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
