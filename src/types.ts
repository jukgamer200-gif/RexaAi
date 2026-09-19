export type SupportedPlatform = 
  | 'paper' 
  | 'purpur' 
  | 'spigot' 
  | 'folia' 
  | 'velocity' 
  | 'bungeecord' 
  | 'fabric';

export type MinecraftVersion = 
  | '26.2 (Next-Gen Paper)'
  | '1.21.4 (Latest Stable)'
  | '1.21.1'
  | '1.20.6'
  | '1.20.4'
  | '1.19.4'
  | '1.18.2'
  | '1.16.5'
  | '1.12.2'
  | '1.8.8';

export interface PluginFile {
  path: string;
  content: string;
  language: 'java' | 'yaml' | 'xml' | 'markdown' | 'json';
  isModified?: boolean;
}

export interface PluginCommand {
  name: string;
  description: string;
  permission: string;
  usage: string;
}

export interface PluginPermission {
  node: string;
  description: string;
  default: 'op' | 'true' | 'false' | 'not op';
}

export interface PluginProject {
  id: string;
  name: string;
  version: string;
  apiVersion: string;
  minecraftVersion: string;
  platform: SupportedPlatform;
  javaVersion: '8' | '11' | '17' | '21';
  mainClass: string;
  packageName: string;
  description: string;
  author: string;
  files: PluginFile[];
  commands: PluginCommand[];
  permissions: PluginPermission[];
  buildStatus: 'ready' | 'compiling' | 'error';
  lastGeneratedAt: string;
}

export interface ErrorDiagnosis {
  rawError: string;
  errorType: string;
  culpritLocation: string;
  rootCause: string;
  explanation: string;
  solutionSummary: string;
  fixedFiles: PluginFile[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  pluginProject?: PluginProject;
  errorDiagnosis?: ErrorDiagnosis;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  currentProject?: PluginProject;
  targetVersion: MinecraftVersion;
  targetPlatform: SupportedPlatform;
}

export interface BlueprintTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  version: MinecraftVersion;
  platform: SupportedPlatform;
  tag: string;
}
