import { 
  Database, 
  FileText, 
  Plane, 
  Share2, 
  Search,
  ShoppingCart
} from 'lucide-react';
import { AgentConfig } from '../types/agent';

export const agents: AgentConfig = {
  'data-extraction': {
    icon: Database,
    title: 'Data Extraction Agent',
    description: 'Scrape data from websites, compile information',
    introduction: [
      'The Data Extraction Agent helps you gather information from websites efficiently and systematically.',
      'Simply provide the URLs you want to extract data from, specify the data points you\'re interested in, and choose your preferred output format.',
      'The agent will handle the extraction process and deliver the results in your chosen format.'
    ],
    inputs: [
      {
        id: 'websites',
        label: 'Website URLs',
        type: 'textarea',
        placeholder: 'Enter URLs (one per line)',
        help: {
          title: 'Website URLs',
          description: 'Enter the complete URLs of the websites you want to extract data from. Each URL should be on a new line.',
          examples: [
            'https://example.com/products/1',
            'https://example.com/products/2'
          ]
        }
      },
      { id: 'dataPoints', label: 'Data Points to Extract', type: 'text', placeholder: 'e.g., prices, titles, descriptions' },
      { id: 'format', label: 'Output Format', type: 'select', options: ['CSV', 'JSON', 'Excel'] }
    ]
  },
  'form-filling': {
    icon: FileText,
    title: 'Form Filling Agent',
    description: 'Automatically fill out online forms',
    introduction: [
      'The Form Filling Agent automates the process of filling out online forms.',
      'Provide the form URL and the data you want to fill in JSON format.',
      'The agent will automatically populate the form fields and optionally submit the form.'
    ],
    inputs: [
      { id: 'formUrl', label: 'Form URL', type: 'text', placeholder: 'Enter form URL' },
      { id: 'formData', label: 'Form Data', type: 'textarea', placeholder: 'Enter form data in JSON format' },
      { id: 'submitAction', label: 'Submit Action', type: 'checkbox', label2: 'Automatically submit form' }
    ]
  },
  'booking': {
    icon: Plane,
    title: 'Booking Assistant Agent',
    description: 'Navigate travel websites, compare options',
    introduction: [
      'The Booking Assistant Agent helps you find and book the best travel options.',
      'Enter your destination, preferred dates, and travel preferences.',
      'The agent will search multiple travel websites to find the best deals and options that match your criteria.'
    ],
    inputs: [
      { id: 'destination', label: 'Destination', type: 'text', placeholder: 'Enter destination' },
      { id: 'dates', label: 'Travel Dates', type: 'date-range' },
      { id: 'preferences', label: 'Preferences', type: 'textarea', placeholder: 'Enter travel preferences' }
    ]
  },
  'social': {
    icon: Share2,
    title: 'Social Media Manager',
    description: 'Post content, engage with followers',
    introduction: [
      'The Social Media Manager Agent helps you manage your social media presence effectively.',
      'Schedule posts across multiple platforms, track engagement, and maintain consistent content delivery.',
      'Simply select your target platforms, enter your content, and set your preferred posting schedule.'
    ],
    inputs: [
      { id: 'platforms', label: 'Platforms', type: 'multi-select', options: ['Twitter', 'LinkedIn', 'Facebook'] },
      { id: 'content', label: 'Content', type: 'textarea', placeholder: 'Enter content to post' },
      { id: 'schedule', label: 'Schedule', type: 'datetime-local' }
    ]
  },
  'research': {
    icon: Search,
    title: 'Research Assistant Agent',
    description: 'Search academic databases, compile reviews',
    introduction: [
      'The Research Assistant Agent helps you gather and analyze academic research efficiently.',
      'Search across multiple academic databases, filter by date range, and compile comprehensive literature reviews.',
      'Specify your research topic, preferred sources, and date range to get started.'
    ],
    inputs: [
      { id: 'topic', label: 'Research Topic', type: 'text', placeholder: 'Enter research topic' },
      { id: 'sources', label: 'Preferred Sources', type: 'multi-select', options: ['PubMed', 'arXiv', 'Google Scholar'] },
      { id: 'dateRange', label: 'Date Range', type: 'date-range' }
    ]
  },
  'ecommerce': {
    icon: ShoppingCart,
    title: 'E-commerce Optimization Agent',
    description: 'Analyze product listings, suggest improvements',
    introduction: [
      'The E-commerce Optimization Agent helps you improve your product listings and sales performance.',
      'Analyze product pages, identify optimization opportunities, and get actionable recommendations.',
      'Provide your product URLs, select your marketplace, and specify your optimization goals.'
    ],
    inputs: [
      { id: 'productUrls', label: 'Product URLs', type: 'textarea', placeholder: 'Enter product URLs (one per line)' },
      { id: 'marketplace', label: 'Marketplace', type: 'select', options: ['Amazon', 'Shopify', 'Etsy'] },
      { id: 'optimizationGoal', label: 'Optimization Goal', type: 'select', options: ['Conversion Rate', 'SEO', 'Price Optimization'] }
    ]
  }
}; 