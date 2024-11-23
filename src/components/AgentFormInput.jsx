import React from 'react';

export const AgentFormInput = ({ input, value, onChange }) => {
  const renderInput = () => {
    switch (input.type) {
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
            {input.options.map(option => (
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
      <label className="block text-sm font-medium">{input.label}</label>
      {renderInput()}
    </div>
  );
}; 