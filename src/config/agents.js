import { 
  Database, 
  FileText, 
  Plane, 
  Share2, 
  Search,
  ShoppingCart
} from 'lucide-react';

export const agents = {
  'data-extraction': {
    icon: Database,
    title: 'Data Extraction Agent',
    description: 'Scrape data from websites, compile information',
    inputs: [
      { id: 'websites', label: 'Website URLs', type: 'textarea', placeholder: 'Enter URLs (one per line)' },
      { id: 'dataPoints', label: 'Data Points to Extract', type: 'text', placeholder: 'e.g., prices, titles, descriptions' },
      { id: 'format', label: 'Output Format', type: 'select', options: ['CSV', 'JSON', 'Excel'] }
    ]
  },
  // ... rest of the agents configuration
}; 