import { useLocation } from "react-router-dom";
import Sidebar from "./components/navigation/Sidebar";
import Topbar from "./components/navigation/Topbar";

const Layout = ({ children, currentRoute = "dashboard", user = null }) => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col">
      {/* Topbar - Fixed height, does not scroll */}
      <div className="flex-shrink-0">
        <Topbar user={user} />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width, does not scroll */}
        <div className="w-64 flex-shrink-0">
          <Sidebar currentRoute={location.pathname} />
        </div>

        {/* Main Content - Only this scrolls */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
