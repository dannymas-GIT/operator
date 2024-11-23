import React from 'react';
import { Loader } from 'lucide-react';

interface AgentResponseProps {
  status: 'idle' | 'running' | 'complete' | 'error';
  data?: any;
  error?: string;
}

export const AgentResponse: React.FC<AgentResponseProps> = ({ status, data, error }) => {
  if (status === 'idle') return null;

  if (status === 'running') {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center space-x-2">
          <Loader className="w-5 h-5 animate-spin text-blue-500" />
          <p className="text-gray-600">Processing your request...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mt-8 p-6 bg-red-50 rounded-lg">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="mt-2 text-red-600">{error || 'An unexpected error occurred'}</p>
      </div>
    );
  }

  if (status === 'complete' && data) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Extracted Data</h3>
        
        {/* Main Content Section */}
        {data.main_content && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Main Content</h4>
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: data.main_content }}
            />
          </div>
        )}

        {/* Raw HTML Section */}
        {data.html_content && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-2">HTML Content</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {data.html_content}
            </pre>
          </div>
        )}

        {/* Metadata Section */}
        {data.metadata && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Metadata</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.metadata).map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-600 font-medium">{key}: </span>
                  <span className="text-gray-700">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Structured Data Section */}
        {data.structured_data && (
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Structured Data</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-auto">
              {JSON.stringify(data.structured_data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return null;
}; 