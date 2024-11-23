import React, { useState } from 'react'

interface FormSchema {
  fields: {
    name: string;
    type: string;
    required: boolean;
    description?: string;
  }[];
}

interface FormFillerAgentProps {
  extractedData?: any;
  agentId?: number | null;
}

const sampleSchema = {
  fields: [
    {
      name: "title",
      type: "string",
      required: true,
      description: "The title of the article"
    },
    {
      name: "author",
      type: "string",
      required: false,
      description: "The author of the article"
    },
    {
      name: "publishDate",
      type: "date",
      required: true,
      description: "Publication date"
    },
    {
      name: "summary",
      type: "text",
      required: true,
      description: "Brief summary of the content"
    }
  ]
};

const FormFillerAgent: React.FC<FormFillerAgentProps> = ({ 
  extractedData = null, 
  agentId = null 
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null)
  const [filledForm, setFilledForm] = useState<any>(null)
  const [localExtractedData, setLocalExtractedData] = useState<any>(extractedData)

  const handleFillForm = async () => {
    if (!extractedData || !formSchema) {
      setError('No extracted data or form schema available')
      return
    }

    setLoading(true)
    setError(null)
    try {
      console.log('Sending form fill request with:', {
        extracted_data: extractedData,
        form_schema: formSchema
      });

      const response = await fetch(`http://localhost:8000/api/v1/agents/${agentId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          action: 'fill_form',
          parameters: {
            extracted_data: extractedData,
            form_schema: formSchema
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
      console.log('Form fill response:', data);
      setFilledForm(data.result)
    } catch (err) {
      console.error('Form fill error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fill form')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Form Filling</h3>
      
      {!extractedData && (
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Extracted Data</h4>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Paste your extracted data here (JSON)"
            value={localExtractedData ? JSON.stringify(localExtractedData, null, 2) : ''}
            onChange={(e) => {
              try {
                setLocalExtractedData(JSON.parse(e.target.value))
                setError(null)
              } catch (err) {
                setError('Invalid extracted data JSON')
              }
            }}
          />
        </div>
      )}
      
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => {
            setFormSchema(sampleSchema);
            setError(null);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Use Sample Schema
        </button>
      </div>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Paste your form schema here (JSON)"
        value={formSchema ? JSON.stringify(formSchema, null, 2) : ''}
        onChange={(e) => {
          try {
            setFormSchema(JSON.parse(e.target.value))
            setError(null)
          } catch (err) {
            setError('Invalid form schema JSON')
          }
        }}
      />
      <button
        onClick={handleFillForm}
        disabled={loading || !formSchema}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? 'Filling Form...' : 'Fill Form'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {filledForm && (
        <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Filled Form</h3>
          <pre className="bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(filledForm, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default FormFillerAgent 