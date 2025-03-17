import { Search, HelpCircle, Bell, User } from "lucide-react";
import logo from "@/assets/icons/logo.svg";

interface DashboardHeaderProps {
  isSidebarCollapsed: boolean;
}

const DashboardHeader = ({ isSidebarCollapsed }: DashboardHeaderProps) => {
  return (
    <header
      className={`w-full bg-white p-4 flex items-center justify-between fixed top-0 z-10 
      ${isSidebarCollapsed ? "pl-20" : "pl-64"} transition-all duration-300
      border-b border-gray-100 backdrop-blur-sm bg-white/80`}
    >
      <div className="flex items-center space-x-2">
        {isSidebarCollapsed && (
          <img src={logo} alt="Logo" className="w-8 h-8 transition-all duration-300" />
        )}
      </div>

      <div className="relative w-1/3 hidden md:block">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 pl-10 rounded-full bg-gray-50 border-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      <div className="flex items-center space-x-5">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <HelpCircle className="text-gray-500 hover:text-blue-500 transition-colors" size={20} />
        </button>
        
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="text-gray-500 hover:text-blue-500 transition-colors" size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            <User/>
          </div>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;