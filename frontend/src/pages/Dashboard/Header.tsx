import React, { useState, useRef, useEffect } from "react";
import {
  HelpCircle,
  Bell,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import logo from "@/assets/icons/logo.svg";

interface DashboardHeaderProps {
  isSidebarCollapsed: boolean;
  username?: string;
  onToggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isSidebarCollapsed,
  username = "User",
  onToggleSidebar,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      text: "New automation completed",
      time: "2 min ago",
      isRead: false,
    },
    {
      id: 2,
      text: "System update available",
      time: "1 hour ago",
      isRead: false,
    },
    { id: 3, text: "Weekly report ready", time: "3 hours ago", isRead: true },
  ];

  return (
    <header
      className={`w-full bg-[#E6F1ED] p-4 flex items-center justify-between fixed top-0 z-10 
      ${isSidebarCollapsed ? "pl-20" : "pl-64"} transition-all duration-300
      border-b border-gray-200 backdrop-blur-md shadow-sm`}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        {isSidebarCollapsed && (
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 transition-all duration-300"
          />
        )}
      </div>

      <div className="flex items-center space-x-1 sm:space-x-3">
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Help"
        >
          <HelpCircle
            className="text-gray-500 hover:text-blue-500 transition-colors"
            size={20}
          />
        </button>

        <div className="relative" ref={notificationsRef}>
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell
              className="text-gray-500 hover:text-blue-500 transition-colors"
              size={20}
            />
            {notifications.some((n) => !n.isRead) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                <h3 className="font-medium text-gray-700">Notifications</h3>
                <button className="text-xs text-blue-500 hover:text-blue-700">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-2 hover:bg-gray-50 ${
                      notification.isRead ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="w-2 h-2 mt-1.5 mr-2">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          {notification.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 px-4 border-t border-gray-100 mt-2">
                <button className="text-sm text-blue-500 hover:text-blue-700 w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
            aria-expanded={showUserMenu}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              <User size={16} />
            </div>
            <span className="hidden sm:block text-sm text-gray-700">
              {username}
            </span>
            <ChevronDown size={14} className="hidden sm:block text-gray-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{username}</p>
                <p className="text-xs text-gray-500">admin@gmail.com</p>
              </div>
              <button className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Settings size={16} />
                <span>Account settings</span>
              </button>
              <button className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
