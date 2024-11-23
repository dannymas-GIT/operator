import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import AgentInterface from './components/AgentInterface'
import { agents } from './config/agents'

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="w-80 bg-gray-900">
          <Navigation />
        </div>
        <div className="flex-1 overflow-auto p-8 bg-white">
          <Routes>
            <Route path="/" element={<Navigate to="/data-extraction" replace />} />
            <Route path="/:agentType" element={<AgentInterface />} />
            <Route path="*" element={
              <div className="p-6">
                <h2 className="text-xl font-bold">404 - Page Not Found</h2>
                <p className="mt-2">The requested agent does not exist.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App 