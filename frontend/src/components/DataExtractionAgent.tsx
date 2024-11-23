import React, { useState, useEffect } from 'react'
import FormFillerAgent from './FormFillerAgent'

interface ExtractedData {
  main_content: string;
  metadata: {
    url: string;
    date?: string;
    categories?: string[];
    archives?: string[];
  };
  structured_data: {
    title: string;
    date: string;
    authors: string[];
    abstract: string;
  }[];
}

const DataExtractionAgent: React.FC = () => {
  const [url, setUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ExtractedData | null>(null)
  const [agentId, setAgentId] = useState<number | null>(null)

  useEffect(() => {
    const initializeAgent = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('http://localhost:8000/api/v1/agents/', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const agents = await response.json();
        const existingAgent = agents.find((a: any) => a.type === 'executor');
        
        if (existingAgent) {
          setAgentId(existingAgent.id);
          return;
        }

        const createResponse = await fetch('http://localhost:8000/api/v1/agents/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: 'Data Extraction Agent',
            description: 'Extracts and processes data from web pages',
            type: 'executor',
            capabilities: {
              'web_scraping': true,
              'data_processing': true
            }
          })
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create agent');
        }

        const newAgent = await createResponse.json();
        setAgentId(newAgent.id);
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'name' in err && err.name === 'AbortError') {
          setError('Request timed out - please check if the backend is running');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to initialize agent');
        }
        console.error('Error initializing agent:', err);
      }
    };

    initializeAgent();
  }, []);

  const handleSubmit = async () => {
    if (!agentId) {
      setError('Agent not initialized')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/agents/${agentId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          action: 'process',
          parameters: {
            input: url
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.detail || `HTTP error! status: ${response.status}`
        )
      }

      const data = await response.json()
      console.log('Response data:', data)
      
      // Parse the result if it's a string
      let parsedResult = data.result
      if (typeof data.result === 'string') {
        try {
          parsedResult = JSON.parse(data.result)
        } catch (parseError) {
          console.error('Error parsing result:', parseError)
          throw new Error('Invalid response format')
        }
      }

      if (!parsedResult) {
        throw new Error('No result data received')
      }
      
      setResult(parsedResult)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error processing URL:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to analyze"
          className="flex-1 p-2 border rounded bg-white text-gray-900 border-gray-300 placeholder-gray-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !agentId}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Extract'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && result.metadata && (
        <div className="mt-6 space-y-6">
          {/* Metadata Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              {result.metadata.url && (
                <div>
                  <span className="text-gray-500">URL:</span>
                  <a href={result.metadata.url} className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">
                    {result.metadata.url}
                  </a>
                </div>
              )}
              {result.metadata.date && (
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2">{formatDate(result.metadata.date)}</span>
                </div>
              )}
            </div>
            {result.metadata.categories && result.metadata.categories.length > 0 && (
              <div className="mt-2">
                <span className="text-gray-500">Categories:</span>
                <div className="flex gap-2 mt-1">
                  {result.metadata.categories.map((cat, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Articles Section */}
          {result.structured_data && result.structured_data.length > 0 && (
            <div className="space-y-4">
              {result.structured_data.map((article, i) => (
                <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <div className="flex gap-4 text-sm text-gray-500 mb-3">
                    {article.date && (
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(article.date)}
                      </div>
                    )}
                    {article.authors && article.authors.length > 0 && (
                      <div>
                        <span className="font-medium">Authors:</span> {article.authors.join(', ')}
                      </div>
                    )}
                  </div>
                  {article.abstract && (
                    <p className="text-gray-700 leading-relaxed">
                      {article.abstract}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Main Content Section */}
          {result.main_content && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Main Content</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {result.main_content}
              </p>
            </div>
          )}
        </div>
      )}

      {result && (
        <FormFillerAgent 
          extractedData={result} 
          agentId={agentId} 
        />
      )}
    </div>
  )
}

export default DataExtractionAgent