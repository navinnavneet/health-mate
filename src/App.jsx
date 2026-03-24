/**
 * App.jsx — Root component
 * Sets up routing for all pages and includes the persistent Navbar.
 */
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import HealthFormPage from "./pages/HealthFormPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/form" element={<HealthFormPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
}

export default App;
