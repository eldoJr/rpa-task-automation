import { useState } from "react";
import {  Zap, FileText, Layers, } from "lucide-react";

const AddAutomation = () => {
  const [automationName, setAutomationName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<string[]>([]);

  const templates = [
    { id: "email-extraction", name: "Email Data Extraction", icon: <FileText size={20} /> },
    { id: "form-filling", name: "Form Filling", icon: <FileText size={20} /> },
    { id: "order-processing", name: "Order Processing", icon: <FileText size={20} /> },
  ];

  const availableIntegrations = [
    { id: "microsoft-excel", name: "Microsoft Excel", icon: <Layers size={20} /> },
    { id: "google-sheets", name: "Google Sheets", icon: <Layers size={20} /> },
    { id: "salesforce", name: "Salesforce", icon: <Layers size={20} /> },
    { id: "zendesk", name: "Zendesk", icon: <Layers size={20} /> },
  ];

  const handleSaveAutomation = () => {
    if (!automationName || !selectedTemplate) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log("Automation Saved:", { automationName, selectedTemplate, integrations });
    alert("Automation saved successfully!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Automation</h1>
          <p className="text-gray-600 mt-2">
            Automate repetitive tasks by creating workflows with drag-and-drop ease. Choose a template or start from scratch.
          </p>
        </div>

        {/* Automation Name Input */}
        <div className="mb-8">
          <label htmlFor="automation-name" className="block text-sm font-medium text-gray-700">
            Automation Name
          </label>
          <input
            type="text"
            id="automation-name"
            value={automationName}
            onChange={(e) => setAutomationName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter automation name"
          />
        </div>

        {/* Templates Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {template.icon}
                  <span className="text-gray-800">{template.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {availableIntegrations.map((integration) => (
              <div
                key={integration.id}
                onClick={() => {
                  if (integrations.includes(integration.id)) {
                    setIntegrations(integrations.filter((id) => id !== integration.id));
                  } else {
                    setIntegrations([...integrations, integration.id]);
                  }
                }}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  integrations.includes(integration.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {integration.icon}
                  <span className="text-gray-800">{integration.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveAutomation}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Zap size={18} className="mr-2" />
            Save Automation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAutomation;