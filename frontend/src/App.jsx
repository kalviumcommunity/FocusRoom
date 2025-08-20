import "./App.css";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Layout from "./layout";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
