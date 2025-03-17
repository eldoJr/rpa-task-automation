import { useState } from "react";
import DashboardHeader from "./Header";
import Sidebar from "./Sidebar";
import OverviewCards from "./OverviewCards";
import StatusChart from "./StatusChart";
import RecordTable from "./RecordTable";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side - cards */}
              <div className="md:w-1/2">
                <OverviewCards isSidebarCollapsed={isSidebarCollapsed} />
              </div>
              
              <div className="md:w-1/2">
                <StatusChart isSidebarCollapsed={isSidebarCollapsed} />
              </div>
            </div>

            <RecordTable isSidebarCollapsed={isSidebarCollapsed} />
          </div>
        );
      case "record-table":
        return <RecordTable isSidebarCollapsed={isSidebarCollapsed} />;
      case "analytics":
        return <div>Analytics Content</div>;
      case "settings":
        return <div>Settings Content</div>; 
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader isSidebarCollapsed={isSidebarCollapsed} />

      <div className="flex flex-1 mt-16">
        <Sidebar
          setActiveSection={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <main
          className={`flex-1 p-6 overflow-y-auto transition-all ${
            isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;