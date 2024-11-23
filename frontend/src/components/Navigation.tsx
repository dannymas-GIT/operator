import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { agents } from '../config/agents';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === `/${path}`;

  return (
    <nav className="bg-gray-900 h-full overflow-auto">
      <div className="p-4">
        {Object.entries(agents).map(([id, agent]) => {
          const Icon = agent.icon;
          return (
            <Link
              key={id}
              to={`/${id}`}
              className={`block mb-4 p-4 rounded-lg transition-colors ${
                isActive(id)
                  ? 'bg-blue-600'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start">
                <Icon className="w-6 h-6 text-white" />
                <div className="ml-3">
                  <h3 className="text-white text-lg font-medium">{agent.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{agent.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation; 