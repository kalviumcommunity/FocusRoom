import "./App.css";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import TeamPage from "./pages/TeamPage";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";

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
          <Route
            path="/tasks"
            element={
              <Layout>
                <Tasks />
              </Layout>
            }
          />
          <Route
            path="/team"
            element={
              <Layout>
                <TeamPage />
              </Layout>
            }
          />
          <Route
            path="/reports"
            element={
              <Layout>
                <Reports />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
