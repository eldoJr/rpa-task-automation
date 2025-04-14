import { useState, useEffect, Suspense, lazy } from "react";
import DashboardHeader from "./Header";
import Sidebar from "./Sidebar";
import { ModernSpinner } from "./ModernSpinner";

// Lazy-loaded components
const OverviewCards = lazy(() => import("./OverviewCards"));
const StatusChart = lazy(() => import("./StatusChart"));
const RecordTable = lazy(() => import("./RecordTable"));
const AddAutomation = lazy(() => import("./AddAutomation"));
const Integrations = lazy(() => import("./Integrations"));
const Projects = lazy(() => import("./projects/Projects"));
const Analytics = lazy(() => import("./Analytics"));
const Monitoring = lazy(() => import("./Monitoring"));
const Templates = lazy(() => import("./Templates"));
const LogsHistory = lazy(() => import("./LogsHistory"));
const Reports = lazy(() => import("./Reports"));
const Settings = lazy(() => import("./Settings"));
const ChatBot = lazy(() => import("./ChatBot"));

// Use type from existing components
type DashboardSection =
  | "overview"
  | "record-table"
  | "integrations"
  | "add-automation"
  | "projects"
  | "analytics"
  | "monitoring"
  | "templates"
  | "logs"
  | "reports"
  | "settings"
  | "chatBot"
  | "home";
const Dashboard = () => {
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeSection]);

  const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
      <ModernSpinner size={60} text="" />
    </div>
  );

  const renderSection = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
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
              return <Reports />;
            case "settings":
              return <Settings />;
            case "chatBot":
              return <ChatBot />;
            default:
              return <div>Select a section</div>;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: "whitesmoke" }}
    >
      <DashboardHeader
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex flex-1 mt-16">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={(section: DashboardSection) =>
            setActiveSection(section)
          }
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <main
          className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="max-w-7xl mx-auto">{renderSection()}</div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
