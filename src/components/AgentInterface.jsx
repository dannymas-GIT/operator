import React, { useState } from 'react';
import { agents } from '../config/agents';
import { AgentCard } from './AgentCard';
import { AgentFormInput } from './AgentFormInput';

const AgentInterface = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formData, setFormData] = useState({});

  const handleAgentSelect = (id) => {
    setSelectedAgent(id);
  };

  const handleInputChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const renderAgentSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(agents).map(([id, agent]) => (
        <AgentCard
          key={id}
          id={id}
          agent={agent}
          onSelect={handleAgentSelect}
        />
      ))}
    </div>
  );

  const renderAgentForm = () => {
    if (!selectedAgent) return null;
    const agent = agents[selectedAgent];

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <agent.icon className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-medium">{agent.title}</h2>
        </div>

        {agent.inputs.map((input) => (
          <AgentFormInput
            key={input.id}
            input={input}
            value={formData[input.id] || ''}
            onChange={handleInputChange}
          />
        ))}

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Run Agent
        </button>
      </form>
    );
  };

  return (
    <div className="p-4">
      {renderAgentSelection()}
      {renderAgentForm()}
    </div>
  );
};

export default AgentInterface; 