import React from "react";
import { Home, CheckSquare, Timer, BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ currentRoute = "dashboard" }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: CheckSquare,
      path: "/tasks",
    },
    {
      id: "pomodoro",
      label: "Pomodoro",
      icon: Timer,
      path: "/pomodoro",
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      path: "/reports",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Navigation Menu */}
      <nav className="flex-1 pt-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                    isActive
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings at bottom */}
      <div className="p-3 border-t border-gray-200">
        <Link
          to="/settings"
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
            currentRoute === "settings"
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
