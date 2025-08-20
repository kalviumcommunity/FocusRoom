import { LogOut } from "lucide-react";

function UserCard({ user, handleLogout }) {
  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {user?.displayName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-100 pt-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserCard;
