import React from 'react';
import { HelpCircle } from 'lucide-react';
import { AgentInput } from '@/types/agent';

interface HelpDialogProps {
  input: AgentInput;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ input }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!input.help) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center text-gray-500 hover:text-gray-700"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">{input.help.title}</h3>
            <p className="text-gray-600 mb-4">{input.help.description}</p>
            
            {input.help.examples && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Examples:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {input.help.examples.map((example, index) => (
                    <li key={index} className="text-gray-600">{example}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 