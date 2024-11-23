import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AgentFormInput } from './AgentFormInput';
import { agents } from '../config/agents';
import { AgentStatus } from '../types/agent';

interface FormData {
  [key: string]: string;
}

const AgentInterface: React.FC = () => {
  const { agentType } = useParams<{ agentType: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({});
  const [status, setStatus] = useState<AgentStatus>('idle');

  const currentAgent = agentType ? agents[agentType] : null;

  useEffect(() => {
    // Redirect to home if agent type is invalid
    if (agentType && !currentAgent) {
      navigate('/');
    }
    // Reset form data when agent type changes
    setFormData({});
    setStatus('idle');
  }, [agentType, currentAgent, navigate]);

  if (!currentAgent) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Invalid agent type</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('running');
    // Simulate agent running
    setTimeout(() => {
      setStatus('complete');
    }, 3000);
  };

  const renderIntroduction = () => (
    <div className="mb-8 bg-gray-50 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <currentAgent.icon className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900">{currentAgent.title}</h1>
      </div>
      <div className="space-y-4">
        {currentAgent.introduction.map((paragraph, index) => (
          <p key={index} className="text-gray-600">{paragraph}</p>
        ))}
      </div>
    </div>
  );

  const renderAgentForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentAgent.inputs.map((input) => (
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

  const renderStatus = () => (
    <div className="space-y-4">
      {status === 'running' ? (
        <Alert>
          <Loader className="w-4 h-4 animate-spin" />
          <AlertDescription>Agent is processing your request...</AlertDescription>
        </Alert>
      ) : status === 'complete' ? (
        <Alert>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <AlertDescription>Task completed successfully!</AlertDescription>
        </Alert>
      ) : status === 'error' ? (
        <Alert>
          <AlertCircle className="w-4 h-4 text-red-500" />
          <AlertDescription>An error occurred. Please try again.</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderIntroduction()}
      {renderAgentForm()}
      {status !== 'idle' && renderStatus()}
    </div>
  );
};

export default AgentInterface; 