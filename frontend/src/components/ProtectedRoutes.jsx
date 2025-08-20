import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/userContext";
import LoadingPage from "../pages/LoadingPage";

function ProtectedRoutes() {
  const { user, loading } = useUser();

  if (loading) return <LoadingPage />;

  return user ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;
