import { useState } from 'react'
import DataExtractionAgent from './components/DataExtractionAgent'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Available Agents</h1>
        
        {/* Agent List */}
        <div className="space-y-4">
          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-blue-400">📊</span>
              <h2 className="text-lg font-semibold">Data Extraction Agent</h2>
            </div>
            <p className="text-sm text-gray-400 mt-2">Scrape data from websites, compile information from multiple sources</p>
          </div>

          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-green-400">📝</span>
              <h2 className="text-lg font-semibold">Form Filling Agent</h2>
            </div>
            <p className="text-sm text-gray-400 mt-2">Automatically fill out online forms, submit applications</p>
          </div>

          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-purple-400">✈️</span>
              <h2 className="text-lg font-semibold">Booking Assistant</h2>
            </div>
            <p className="text-sm text-gray-400 mt-2">Navigate travel websites, compare options, make reservations</p>
          </div>

          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-pink-400">📱</span>
              <h2 className="text-lg font-semibold">Social Media Manager</h2>
            </div>
            <p className="text-sm text-gray-400 mt-2">Post content, engage with followers, analyze metrics</p>
          </div>

          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-yellow-400">🔍</span>
              <h2 className="text-lg font-semibold">Research Assistant</h2>
            </div>
            <p className="text-sm text-gray-400 mt-2">Search academic databases, compile literature reviews</p>
          </div>

          <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-red-400">🛍️</span>
              <h2 className="text-lg font-semibold">E-commerce Optimization</h2>
            </div>
            <p className="text-sm text-gray-400 mt-2">Analyze product listings, suggest improvements, update content</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white">
        <div className="max-w-4xl mx-auto p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Extraction Agent</h2>
          <DataExtractionAgent />
        </div>
      </div>
    </div>
  )
}

export default App 