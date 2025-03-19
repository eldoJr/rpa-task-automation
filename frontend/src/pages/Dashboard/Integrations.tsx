import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import {
  SiGoogleforms,
  SiGoogledocs,
  SiGooglesheets,
  SiSlack,
  SiTrello,
  SiSalesforce,
  SiZendesk,
  SiSap,
  SiQuickbooks,
  SiHubspot,
  SiDropbox,
  SiZoom,
  SiAsana,
  SiGithub,
  SiJira,
} from "react-icons/si";
import { FaEnvelope } from "react-icons/fa";

// define the Card component inline
const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return <div className={className}>{children}</div>;
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Popularity");
  const [displayedIntegrations, setDisplayedIntegrations] = useState<
    Integration[]
  >([]);

  const categories = [
    "Core Nodes",
    "Analytics",
    "Marketing",
    "Langchain",
    "AI",
    "Developer Tools",
    "Sales",
    "Data & Storage",
    "Productivity",
    "Communication",
    "Miscellaneous",
    "Finance & Accounting",
    "Development",
    "Utility",
    "HITL",
    "Cybersecurity",
  ];

  // Memoize the integrations array
  const integrations = useMemo<Integration[]>(
    () => [
      {
        id: "microsoft-excel",
        name: "Microsoft Excel",
        icon: <SiGoogledocs />,
        color: "#217346",
        description:
          "Microsoft Excel is a spreadsheet program used for data analysis, calculations, and visualization.",
        category: "Data & Storage",
      },
      {
        id: "microsoft-outlook",
        name: "Microsoft Outlook",
        icon: <FaEnvelope />,
        color: "#0072C6",
        description:
          "Microsoft Outlook is an email client and personal information manager used for managing emails, calendars, and contacts.",
        category: "Communication",
      },
      {
        id: "google-forms",
        name: "Google Forms",
        icon: <SiGoogleforms />,
        color: "#6264A7",
        description:
          "Microsoft Teams is a collaboration platform for chat, video meetings, and file sharing within organizations.",
        category: "Communication",
      },
      {
        id: "google-sheets",
        name: "Google Sheets",
        icon: <SiGooglesheets />,
        color: "#0F9D58",
        description:
          "Google Sheets is a web-based spreadsheet program offered by Google for free. It is similar to Microsoft Excel with collaboration features.",
        category: "Data & Storage",
      },
      {
        id: "slack",
        name: "Slack",
        icon: <SiSlack />,
        color: "#4A154B",
        description:
          "Slack is a messaging platform for teams, offering channels, direct messaging, and integrations with other tools.",
        category: "Communication",
      },
      {
        id: "trello",
        name: "Trello",
        icon: <SiTrello />,
        color: "#0079BF",
        description:
          "Trello is a project management tool that uses boards, lists, and cards to organize tasks and workflows.",
        category: "Project Management",
      },
      {
        id: "salesforce",
        name: "Salesforce",
        icon: <SiSalesforce />,
        color: "#00A1E0",
        description:
          "Salesforce is a cloud-based CRM platform used for managing customer relationships, sales, and marketing.",
        category: "CRM",
      },
      {
        id: "zendesk",
        name: "Zendesk",
        icon: <SiZendesk />,
        color: "#03363D",
        description:
          "Zendesk is a customer service platform that provides tools for ticketing, live chat, and customer support.",
        category: "Customer Support",
      },
      {
        id: "sap",
        name: "SAP",
        icon: <SiSap />,
        color: "#0FAAFF",
        description:
          "SAP is an enterprise resource planning (ERP) software used for managing business operations and customer relations.",
        category: "ERP",
      },
      {
        id: "quickbooks",
        name: "QuickBooks",
        icon: <SiQuickbooks />,
        color: "#2CA01C",
        description:
          "QuickBooks is an accounting software designed for small and medium-sized businesses to manage finances.",
        category: "Finance",
      },
      {
        id: "hubspot",
        name: "HubSpot",
        icon: <SiHubspot />,
        color: "#FF7A59",
        description:
          "HubSpot is a marketing, sales, and customer service platform that helps businesses grow and manage customer relationships.",
        category: "Marketing & CRM",
      },
      {
        id: "dropbox",
        name: "Dropbox",
        icon: <SiDropbox />,
        color: "#0061FF",
        description:
          "Dropbox is a cloud storage service that allows users to store and share files online.",
        category: "Data & Storage",
      },
      {
        id: "zoom",
        name: "Zoom",
        icon: <SiZoom />,
        color: "#2D8CFF",
        description:
          "Zoom is a video conferencing platform used for virtual meetings, webinars, and online collaboration.",
        category: "Communication",
      },
      {
        id: "asana",
        name: "Asana",
        icon: <SiAsana />,
        color: "#FF6B6B",
        description:
          "Asana is a project management tool that helps teams organize, track, and manage their work.",
        category: "Project Management",
      },
      {
        id: "github",
        name: "GitHub",
        icon: <SiGithub />,
        color: "#181717",
        description:
          "GitHub is a platform for version control and collaboration, allowing developers to work on code together.",
        category: "Development",
      },
      {
        id: "jira",
        name: "Jira",
        icon: <SiJira />,
        color: "#0052CC",
        description:
          "Jira is a project management tool designed for agile teams to plan, track, and release software.",
        category: "Project Management",
      },
    ],
    []
  );

  useEffect(() => {
    let filteredResults = [...integrations];

    if (selectedCategories.length > 0) {
      filteredResults = filteredResults.filter((integration) =>
        selectedCategories.includes(integration.category)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredResults = filteredResults.filter(
        (integration) =>
          integration.name.toLowerCase().includes(query) ||
          integration.description.toLowerCase().includes(query) ||
          integration.category.toLowerCase().includes(query)
      );
    }

    filteredResults = [...filteredResults].sort((a, b) => {
      if (sortBy === "Name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "Category") {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    setDisplayedIntegrations(filteredResults);
  }, [searchQuery, selectedCategories, sortBy, integrations]); //  integrations is stable

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 p-4 border-r border-gray-200 bg-white shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={category}
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={category}
                className="text-sm cursor-pointer hover:text-blue-600 transition-colors"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedIntegrations.map((integration) => (
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
                <span className="text-xs text-gray-500 mt-1">
                  {integration.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 text-center line-clamp-3 mt-2">
                {integration.description}
              </p>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                  Add Integration
                </button>
              </div>
            </Card>
          ))}
        </div>

        {displayedIntegrations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">
              No integrations found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
