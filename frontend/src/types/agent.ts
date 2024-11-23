import { LucideIcon } from 'lucide-react';

export interface AgentInputHelp {
  title: string;
  description: string;
  examples?: string[];
}

export interface AgentInput {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  label2?: string;
  help?: AgentInputHelp;
}

export interface Agent {
  icon: LucideIcon;
  title: string;
  description: string;
  introduction: string[];
  inputs: AgentInput[];
}

export interface AgentConfig {
  [key: string]: Agent;
}

export type AgentStatus = 'idle' | 'running' | 'complete' | 'error'; 