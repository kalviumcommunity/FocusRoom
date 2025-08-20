import { Search, ChevronDown, Timer } from "lucide-react";
import { useUser } from "../../context/userContext";

const Topbar = () => {
  const { user } = useUser();
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

      {/* Search Bar */}
      {/* <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
          />
        </div>
      </div> */}

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
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
        </div>
      </div>
    </div>
  );
};

export default Topbar;
