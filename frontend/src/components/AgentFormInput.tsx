import React from 'react';
import { AgentInput } from '../types/agent';
import { HelpDialog } from './ui/HelpDialog';

interface AgentFormInputProps {
  input: AgentInput;
  value: string;
  onChange: (id: string, value: string) => void;
}

export const AgentFormInput: React.FC<AgentFormInputProps> = ({ input, value, onChange }) => {
  const renderInput = () => {
    switch (input.type) {
      case 'checkbox':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={value === 'true'}
              onChange={(e) => onChange(input.id, e.target.checked.toString())}
            />
            <span className="text-sm text-gray-700">{input.label2}</span>
          </label>
        );
      case 'textarea':
        return (
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder={input.placeholder}
            rows={4}
            value={value}
            onChange={(e) => onChange(input.id, e.target.value)}
          />
        );
      case 'select':
        return (
          <select
            className="w-full p-2 border rounded-md"
            value={value}
            onChange={(e) => onChange(input.id, e.target.value)}
          >
            <option value="">Select option...</option>
            {input.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={input.type}
            className="w-full p-2 border rounded-md"
            placeholder={input.placeholder}
            value={value}
            onChange={(e) => onChange(input.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {input.type !== 'checkbox' && (
          <label className="block text-sm font-medium">{input.label}</label>
        )}
        <HelpDialog input={input} />
      </div>
      {renderInput()}
    </div>
  );
}; 