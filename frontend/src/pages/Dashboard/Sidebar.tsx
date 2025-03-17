import { Home, Layers, PlusCircle, Folder, BarChart2, Settings, MessageSquare, Menu, X } from "lucide-react";
import logo from "@/assets/icons/logo.svg";

interface SidebarProps {
  setActiveSection: (section: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}


interface NavItem {
  icon: React.ReactNode;
  label: string;
  section: string;
  action?: () => void;
}

const Sidebar = ({ setActiveSection, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const navItems: NavItem[] = [
    { icon: <Home size={20} />, label: "Home", section: "home", action: () => window.location.reload() },
    { icon: <Layers size={20} />, label: "Integrations", section: "integrations" },
    { icon: <PlusCircle size={20} />, label: "Add Automation", section: "add-automation" },
    { icon: <Folder size={20} />, label: "Projects", section: "projects" },
    { icon: <BarChart2 size={20} />, label: "Analytics", section: "analytics" },
    { icon: <Settings size={20} />, label: "Settings", section: "settings" },
  ];

  return (
    <aside
      className={`bg-gray-900 text-white h-screen p-4 transition-all duration-300 fixed top-0 left-0 z-20 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      aria-label="Sidebar"
    >

      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && <img src={logo} alt="Logo" className="h-8" />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-300 hover:text-white focus:outline-none p-1 rounded-md hover:bg-gray-800 transition-colors"
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="mt-6">
        <ul className="space-y-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveSection(item.section); 
                  }
                }}
                className="flex items-center space-x-3 p-2 rounded-lg transition-colors w-full hover:bg-gray-800 hover:text-gray-300"
                aria-label={item.label}
              >
                <div className={isCollapsed ? "mx-auto" : ""}>
                  {item.icon}
                </div>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 border-t border-gray-700 pt-4">
        <button
          onClick={() => setActiveSection("ai-suggestions")}
          className="flex items-center space-x-3 p-2 rounded-lg transition-colors w-full hover:bg-gray-800 hover:text-gray-300"
          aria-label="AI Suggestions"
        >
          <div className={isCollapsed ? "mx-auto" : ""}>
            <MessageSquare size={20} />
          </div>
          {!isCollapsed && <span>AI Suggestions</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;