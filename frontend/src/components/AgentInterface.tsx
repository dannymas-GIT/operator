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
import { AgentResponse } from './AgentResponse';

interface FormData {
  [key: string]: string;
}

const AgentInterface: React.FC = () => {
  const { agentType } = useParams<{ agentType: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({});
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [responseData, setResponseData] = useState<any>(null);

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
    
    try {
      // Prepare the request payload based on agent type
      let payload;
      if (agentType === 'data-extraction') {
        payload = {
          urls: formData.websites?.split('\n').filter(url => url.trim()),
          data_points: formData.dataPoints?.split(',').map(point => point.trim()),
          output_format: formData.format?.toLowerCase(),
          preserve_html: formData.preserveHtml === 'true'
        };
      } else {
        payload = formData;
      }

      console.log('Sending request with payload:', payload); // Debug log

      const response = await fetch(`http://localhost:8000/api/v1/agents/${agentType}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Failed to process request');
      }

      const result = await response.json();
      console.log('Received response:', result); // Debug log
      setResponseData(result);
      setStatus('complete');
    } catch (error) {
      console.error('Error processing request:', error);
      setStatus('error');
    }
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderIntroduction()}
      {renderAgentForm()}
      <AgentResponse 
        status={status}
        data={responseData}
        error={status === 'error' ? 'Failed to process request' : undefined}
      />
    </div>
  );
};

export default AgentInterface; 