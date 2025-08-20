import { Timer } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-12">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Timer className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">FocusFlow</span>
        </div>

        {/* Loading spinner */}
        <div className="w-8 h-8 mx-auto mb-8">
          <div className="w-full h-full border-2 border-gray-700 border-t-red-500 rounded-full animate-spin"></div>
        </div>

        {/* Loading text */}
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
