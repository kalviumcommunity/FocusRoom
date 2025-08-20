import { useLocation } from "react-router-dom";
import Sidebar from "./components/navigation/Sidebar";
import Topbar from "./components/navigation/Topbar";

const Layout = ({ children, currentRoute = "dashboard", user = null }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar - Full Width */}
      <Topbar user={user} />

      {/* Content Area with Sidebar and Main */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar currentRoute={location.pathname} />

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
