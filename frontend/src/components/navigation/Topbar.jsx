import { ChevronDown, Timer } from "lucide-react";
import { useUser } from "../../context/userContext";
import { useState } from "react";
import UserCard from "../UserCard";

const Topbar = () => {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* App Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Timer className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">FocusFlow</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button
            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => {
              console.log(isOpen);
              setIsOpen((prev) => !prev);
            }}
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.displayName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {isOpen && <UserCard user={user} handleLogout={logout} />}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
