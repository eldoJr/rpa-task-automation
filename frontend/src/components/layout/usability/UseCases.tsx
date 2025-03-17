import { useState } from "react";

const UseCases = () => {
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const [showMoreUseCases, setShowMoreUseCases] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreTemplates, setShowMoreTemplates] = useState(false);
  const [showMoreGuides, setShowMoreGuides] = useState(false);

  return (
    <section className="bg-[#f3f3f6] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-black">
        <div>
          <h3 className="font-semibold text-base mb-4">Popular Features</h3>
          <ul className="space-y-2 text-sm">
            <li>Automated Workflows</li>
            <li>Template Customization</li>
            <li>Real-time Collaboration</li>
            <li>Approval Management</li>
            <li>Data Export & Integration</li>
            <li>Smart Analytics</li>
            {showMoreFeatures && (
              <>
                <li>Custom Dashboards</li>
                <li>Role-based Access</li>
                <li>API Integrations</li>
              </>
            )}
            <li
              className="text-blue-600 cursor-pointer text-sm"
              onClick={() => setShowMoreFeatures(!showMoreFeatures)}
            >
              {showMoreFeatures ? "Show less" : "Show more"}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-4">Trending Use Cases</h3>
          <ul className="space-y-2 text-sm">
            <li>Automating RFP Processes</li>
            <li>Vendor Comparisons</li>
            <li>Contract Approvals</li>
            <li>Compliance Management</li>
            <li>Project Bidding Automation</li>
            <li>Proposal Generation</li>
            {showMoreUseCases && (
              <>
                <li>Expense Tracking</li>
                <li>Risk Assessment</li>
                <li>Vendor Onboarding</li>
              </>
            )}
            <li
              className="text-blue-600 cursor-pointer text-sm"
              onClick={() => setShowMoreUseCases(!showMoreUseCases)}
            >
              {showMoreUseCases ? "Show less" : "Show more"}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-4">Top Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>Procurement</li>
            <li>Finance & Budgeting</li>
            <li>Sales & Marketing</li>
            <li>AI-powered Automation</li>
            <li>Data Security</li>
            <li>Team Collaboration</li>
            {showMoreCategories && (
              <>
                <li>Legal & Compliance</li>
                <li>HR & Recruitment</li>
                <li>Customer Support</li>
              </>
            )}
            <li
              className="text-blue-600 cursor-pointer text-sm"
              onClick={() => setShowMoreCategories(!showMoreCategories)}
            >
              {showMoreCategories ? "Show less" : "Show more"}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-4">Trending Templates</h3>
          <ul className="space-y-2 text-sm">
            <li>AI-powered RFP Draft</li>
            <li>Customizable Proposal Builder</li>
            <li>Vendor Selection Criteria</li>
            <li>Automated Invoice Approval</li>
            <li>Contract Renewal Tracker</li>
            <li>Legal Compliance Checklist</li>
            {showMoreTemplates && (
              <>
                <li>Project Timeline Template</li>
                <li>Risk Assessment Template</li>
                <li>Expense Report Template</li>
              </>
            )}
            <li
              className="text-blue-600 cursor-pointer text-sm"
              onClick={() => setShowMoreTemplates(!showMoreTemplates)}
            >
              {showMoreTemplates ? "Show less" : "Show more"}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-4">Helpful Guides</h3>
          <ul className="space-y-2 text-sm">
            <li>How to Automate RFPs</li>
            <li>Best AI Tools for Business</li>
            <li>Improving Procurement Efficiency</li>
            <li>Compliance & Risk Management</li>
            <li>Integrating AI in Workflows</li>
            <li>Smart Decision Making</li>
            {showMoreGuides && (
              <>
                <li>Vendor Management Best Practices</li>
                <li>Data Security Guidelines</li>
                <li>Workflow Optimization Tips</li>
              </>
            )}
            <li
              className="text-blue-600 cursor-pointer text-sm"
              onClick={() => setShowMoreGuides(!showMoreGuides)}
            >
              {showMoreGuides ? "Show less" : "Show more"}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default UseCases;