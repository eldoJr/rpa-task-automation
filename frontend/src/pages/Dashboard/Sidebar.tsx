import React from "react";
import {
  Home,
  Layers,
  PlusCircle,
  Folder,
  BarChart2,
  Settings,
  MessageSquare,
  Menu,
  X,
  Clock,
  FileText,
  Database,
  List,
} from "lucide-react";
import logo from "@/assets/icons/logo.svg";

type DashboardSection =
  | "home"
  | "integrations"
  | "add-automation"
  | "projects"
  | "analytics"
  | "monitoring"
  | "templates"
  | "logs"
  | "reports"
  | "settings"
  | "chatBot";

interface SidebarProps {
  activeSection?: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  section: DashboardSection;
  action?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isCollapsed,
  setIsCollapsed,
}) => {
  const navItems: NavItem[] = [
    {
      icon: <Home size={20} />,
      label: "Home",
      section: "home",
      action: () => window.location.reload(),
    },
    {
      icon: <Layers size={20} />,
      label: "Integrations",
      section: "integrations",
    },
    {
      icon: <PlusCircle size={20} />,
      label: "Add Automation",
      section: "add-automation",
    },
    { icon: <Folder size={20} />, label: "Projects", section: "projects" },
    { icon: <BarChart2 size={20} />, label: "Analytics", section: "analytics" },
    {
      icon: <Clock size={20} />,
      label: "Real-Time Monitoring",
      section: "monitoring",
    },
    { icon: <FileText size={20} />, label: "Templates", section: "templates" },
    { icon: <Database size={20} />, label: "Logs & History", section: "logs" },
    { icon: <List size={20} />, label: "Reports", section: "reports" },
    { icon: <Settings size={20} />, label: "Settings", section: "settings" },
  ];

  const handleNavItemClick = (item: NavItem) => {
    if (item.action) {
      item.action();
    } else {
      setActiveSection(item.section);
    }
  };

  return (
    <aside
      className={`bg-gray-900 text-white h-screen transition-all duration-300 fixed top-0 left-0 z-20 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      aria-label="Sidebar"
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <img src={logo} alt="Logo" className="h-8" />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-300 hover:text-white focus:outline-none p-1 rounded-md hover:bg-gray-800 transition-colors"
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.section}>
              <button
                onClick={() => handleNavItemClick(item)}
                className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                  activeSection === item.section
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-800 hover:text-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-gray-700 ${
                  isCollapsed ? "justify-center" : "justify-start space-x-3"
                }`}
                aria-label={item.label}
                aria-current={
                  activeSection === item.section ? "page" : undefined
                }
              >
                <div>{item.icon}</div>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setActiveSection("chatBot")}
          className={`flex items-center w-full p-2 rounded-lg transition-colors ${
            activeSection === "chatBot"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-800 hover:text-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-gray-700 ${
            isCollapsed ? "justify-center" : "justify-start space-x-3"
          }`}
          aria-label="AI Suggestions"
          aria-current={activeSection === "chatBot" ? "page" : undefined}
        >
          <div>
            <MessageSquare size={20} />
          </div>
          {!isCollapsed && <span>AI Suggestions</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
