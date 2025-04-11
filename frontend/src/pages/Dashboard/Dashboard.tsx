import { useState } from "react";
import DashboardHeader from "./Header";
import Sidebar from "./Sidebar";
import OverviewCards from "./OverviewCards";
import StatusChart from "./StatusChart";
import RecordTable from "./RecordTable";
import AddAutomation from "./AddAutomation";
import Integrations from "./Integrations";
import Projects from "./Projects";
import Analytics from "./Analytics";
import Monitoring from "./Monitoring";
import Templates from "./Templates";
import LogsHistory from "./LogsHistory";
import Reports from "./Reports";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
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
      case "integrations":
        return <Integrations />;
      case "settings":
        return <div>Settings Content</div>;
      case "add-automation":
        return <AddAutomation />;
      case "projects":
        return <Projects />;
      case "analytics":
        return <Analytics />;
      case "monitoring":
        return <Monitoring />;
      case "templates":
        return <Templates />;
      case "logs":
        return <LogsHistory />;
      case "reports":
        return <Reports/>
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
