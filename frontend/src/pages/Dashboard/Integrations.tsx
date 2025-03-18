import React, { useState, useEffect, useMemo } from 'react'; // Add useMemo
import { Search } from 'lucide-react';
import { 
  SiGoogle, 
  SiTelegram, 
  SiGmail, 
  SiMysql, 
  SiSlack, 
  SiDiscord, 
  SiPostgresql, 
  SiNotion, 
  SiAirtable, 
  SiGithub 
} from 'react-icons/si';

// Define the Card component inline
const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  category: string;
}

const Integrations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('Popularity');
  const [displayedIntegrations, setDisplayedIntegrations] = useState<Integration[]>([]);
  
  const categories = [
    'Core Nodes',
    'Analytics',
    'Marketing',
    'Langchain',
    'AI',
    'Developer Tools',
    'Sales',
    'Data & Storage',
    'Productivity',
    'Communication',
    'Miscellaneous',
    'Finance & Accounting',
    'Development',
    'Utility',
    'HITL',
    'Cybersecurity'
  ];
  
  // Memoize the integrations array
  const integrations = useMemo<Integration[]>(() => [
    {
      id: 'http-request',
      name: 'HTTP Request',
      icon: <SiGoogle />,
      color: '#4285F4',
      description: 'Send HTTP requests to external APIs and services',
      category: 'Developer Tools'
    },
    {
      id: 'webhook',
      name: 'Webhook',
      icon: <SiGoogle />,
      color: '#34A853',
      description: 'Webhooks are automatic notifications that apps send when something occurs. They allow real-time data transfer when triggered by events.',
      category: 'Developer Tools'
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      icon: <SiGoogle />,
      color: '#0F9D58',
      description: 'Google Sheets is a web-based spreadsheet program offered by Google for free. It similar to Microsoft Excel with collaboration features.',
      category: 'Data & Storage'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <SiTelegram />,
      color: '#0088cc',
      description: 'Telegram is one of the fastest and most secured messaging apps on the market, connecting millions of active users.',
      category: 'Communication'
    },
    {
      id: 'send-email',
      name: 'Send Email',
      icon: <SiGmail />,
      color: '#EA4335',
      description: 'Send emails from your workflows to any recipient.',
      category: 'Communication'
    },
    {
      id: 'mysql',
      name: 'MySQL',
      icon: <SiMysql />,
      color: '#4479A1',
      description: 'The relational database management system MySQL is free and open-source. Although SQL is the language used to interact with the database.',
      category: 'Data & Storage'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: <SiSlack />,
      color: '#4A154B',
      description: 'Slack is a powerful collaboration tool for businesses of all sizes. It helps teams work together more efficiently.',
      category: 'Communication'
    },
    {
      id: 'spreadsheet',
      name: 'Spreadsheet File',
      icon: <SiGoogle />,
      color: '#34A853',
      description: 'Work with Excel, CSV, and other spreadsheet files in your workflows.',
      category: 'Data & Storage'
    },
    {
      id: 'telegram-trigger',
      name: 'Telegram Trigger',
      icon: <SiTelegram />,
      color: '#0088cc',
      description: 'Telegram is one of the fastest and most secured messaging apps on the market, connecting millions of active users.',
      category: 'Communication'
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: <SiDiscord />,
      color: '#5865F2',
      description: 'Discord helps a group of people communicate online and share activities together.',
      category: 'Communication'
    },
    {
      id: 'postgres',
      name: 'Postgres',
      icon: <SiPostgresql />,
      color: '#336791',
      description: 'Postgres, or PostgreSQL, is a free, open-source tool that helps you emphasize extensibility and SQL compliance.',
      category: 'Data & Storage'
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: <SiNotion />,
      color: '#000000',
      description: 'Notion is an all-in-one workspace for you and your team. It helps team members communicate and share knowledge.',
      category: 'Productivity'
    },
    {
      id: 'gmail',
      name: 'Gmail',
      icon: <SiGmail />,
      color: '#EA4335',
      description: 'Gmail is a free of charge email service offered as part of Google Workspace. It is used by millions of people worldwide.',
      category: 'Communication'
    },
    {
      id: 'airtable',
      name: 'Airtable',
      icon: <SiAirtable />,
      color: '#F95561',
      description: 'Airtable is the best tool to develop your business. It helps you connect, reunite and organize everything you need.',
      category: 'Data & Storage'
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: <SiGoogle />,
      color: '#FBBC05',
      description: 'Google Drive is a storage and synchronization service offered by Google. It allows individuals to store files in the cloud.',
      category: 'Data & Storage'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <SiGithub />,
      color: '#181717',
      description: 'GitHub is the number one platform for developers. It boosts their software development processes.',
      category: 'Developer Tools'
    }
  ], []); // Empty dependency array ensures this is only computed once

  // Filter and sort integrations based on search, categories, and sort option
  useEffect(() => {
    let filteredResults = [...integrations];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredResults = filteredResults.filter(integration => 
        selectedCategories.includes(integration.category)
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredResults = filteredResults.filter(integration => 
        integration.name.toLowerCase().includes(query) || 
        integration.description.toLowerCase().includes(query) ||
        integration.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filteredResults = [...filteredResults].sort((a, b) => {
      if (sortBy === 'Name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'Category') {
        return a.category.localeCompare(b.category);
      }
      // Default: sort by "Popularity" (we'll use the order in the array as popularity)
      return 0;
    });
    
    setDisplayedIntegrations(filteredResults);
  }, [searchQuery, selectedCategories, sortBy, integrations]); // Now integrations is stable

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 p-4 border-r border-gray-200 bg-white shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={category}
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={category} className="text-sm cursor-pointer hover:text-blue-600 transition-colors">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for integrations, categories..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-96 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            {displayedIntegrations.length} of {integrations.length} integrations
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Popularity">Popularity</option>
              <option value="Name">Name</option>
              <option value="Category">Category</option>
            </select>
          </div>
        </div>

        {/* Grid of integrations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedIntegrations.map(integration => (
            <Card
              key={integration.id} 
              className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="flex flex-col items-center mb-3">
                <div 
                  className="text-3xl mb-3 p-3 rounded-full bg-gray-50 group-hover:scale-110 transition-transform" 
                  style={{ color: integration.color }}
                >
                  {integration.icon}
                </div>
                <h3 className="font-medium text-center">{integration.name}</h3>
                <span className="text-xs text-gray-500 mt-1">{integration.category}</span>
              </div>
              <p className="text-sm text-gray-600 text-center line-clamp-3 mt-2">
                {integration.description}
              </p>
              <div className="mt-4 text-center">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  Add Integration
                </button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Empty state */}
        {displayedIntegrations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No integrations found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;