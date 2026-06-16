import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import AdminDashboard from './pages/admin/AdminDashboard';
//import AdminClients from './pages/admin/AdminClients';
import AdminFeatures from './pages/admin/AdminFeatures';
import AdminProjectTypes from './pages/admin/AdminProjectTypes';
import AdminTechStacks from './pages/admin/AdminTechStacks';


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/features" element={<AdminFeatures />} />
          <Route path="/admin/project-types" element={<AdminProjectTypes />} />
          <Route path="/admin/tech-stacks" element={<AdminTechStacks />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
