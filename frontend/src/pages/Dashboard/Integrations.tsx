import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  X,
  Filter,
  Grid,
  List,
  Layers,
  Maximize,
} from "lucide-react";
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

// component with hover effects
const Card: React.FC<{
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ className, children, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Popularity");
  const [displayedIntegrations, setDisplayedIntegrations] = useState<
    Integration[]
  >([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [hoveredIntegration, setHoveredIntegration] = useState<string | null>(
    null
  );

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
    "Project Management",
    "CRM",
    "Customer Support",
    "ERP",
    "Finance",
    "Marketing & CRM",
  ];

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

  // group integrations by category
  const integrationsByCategory = useMemo(() => {
    const grouped: Record<string, Integration[]> = {};

    for (const integration of displayedIntegrations) {
      if (!grouped[integration.category]) {
        grouped[integration.category] = [];
      }
      grouped[integration.category].push(integration);
    }

    return grouped;
  }, [displayedIntegrations]);

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
  }, [searchQuery, selectedCategories, sortBy, integrations]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  const toggleMobileFilters = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const handleIntegrationHover = (id: string) => {
    setHoveredIntegration(id);
  };

  const handleIntegrationLeave = () => {
    setHoveredIntegration(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div
        className={`${
          isMobileFilterOpen ? "block" : "hidden"
        } md:block md:w-72 p-6 border-r border-gray-100 bg-white shadow-lg md:static fixed inset-0 z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-xl text-gray-800">Filters</h2>
          <button
            onClick={toggleMobileFilters}
            className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close filters"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* active Filters */}
        {selectedCategories.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">Active filters</span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                aria-label="Clear all filters"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <div
                  key={`filter-${category}`}
                  className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-3 py-1.5 rounded-full text-xs shadow-sm"
                >
                  {category}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="ml-1.5 text-blue-500 hover:text-blue-700 transition-colors"
                    aria-label={`Remove ${category} filter`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-medium text-sm mb-3 text-gray-700">Categories</h3>
          <div className="max-h-96 overflow-y-auto pr-2">
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center py-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor={category}
                  className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto md:max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for integrations, categories..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-96 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <button
              onClick={toggleMobileFilters}
              className="md:hidden flex items-center gap-1 text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {selectedCategories.length > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Popularity">Popularity</option>
                    <option value="Name">Name</option>
                    <option value="Category">Category</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {displayedIntegrations.length} of {integrations.length}{" "}
            integrations
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedIntegrations.map((integration) => (
              <Card
                key={integration.id}
                className="bg-white p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group cursor-pointer relative"
                onClick={() => {}}
                onMouseEnter={() => handleIntegrationHover(integration.id)}
                onMouseLeave={handleIntegrationLeave}
              >
                <div className="flex flex-col items-center mb-3">
                  <div
                    className="text-3xl mb-3 p-4 rounded-full bg-gray-50 group-hover:bg-opacity-80 transition-all duration-300 group-hover:scale-110"
                    style={{ color: integration.color }}
                  >
                    {integration.icon}
                  </div>
                  <h3 className="font-medium text-center">
                    {integration.name}
                  </h3>
                  <span className="text-xs text-gray-500 mt-1 px-2 py-1 bg-gray-50 rounded-full">
                    {integration.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 text-center line-clamp-3 mt-3">
                  {integration.description}
                </p>
                <div className="mt-4 flex justify-center">
                  <button className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium px-4 py-2 rounded-lg">
                    Add Integration
                  </button>
                </div>

                {hoveredIntegration === integration.id && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                      <Maximize className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            {Object.entries(integrationsByCategory).map(([category, items]) => (
              <div
                key={category}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <Layers className="h-4 w-4 text-gray-500 mr-2" />
                    <h3 className="font-medium text-gray-700">{category}</h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    {items.length} integrations
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onMouseEnter={() =>
                        handleIntegrationHover(integration.id)
                      }
                      onMouseLeave={handleIntegrationLeave}
                    >
                      <div
                        className="flex items-center justify-center h-10 w-10 rounded-lg mr-3"
                        style={{
                          backgroundColor: `${integration.color}10`,
                          color: integration.color,
                        }}
                      >
                        {integration.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900 truncate">
                            {integration.name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {integration.description}
                        </p>
                      </div>
                      <button className="ml-4 text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">
                        Add Integration
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {displayedIntegrations.length === 0 && (
          <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl py-12 px-4">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">
              No integrations found
            </h3>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              Try adjusting your search or filters to find what you're looking
              for
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg text-sm transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
