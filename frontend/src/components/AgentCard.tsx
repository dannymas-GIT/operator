import React from 'react';
import { Agent } from '../types/agent';

interface AgentCardProps {
  id: string;
  agent: Agent;
  onSelect: (id: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ id, agent, onSelect }) => {
  const Icon = agent.icon;
  
  return (
    <div
      className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
      onClick={() => onSelect(id)}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-6 h-6 text-blue-500" />
        <h3 className="font-medium">{agent.title}</h3>
      </div>
      <p className="mt-2 text-sm text-gray-600">{agent.description}</p>
    </div>
  );
}; 