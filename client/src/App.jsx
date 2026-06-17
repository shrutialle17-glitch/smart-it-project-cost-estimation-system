import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ClientDashboard from "./pages/ClientDashboard";
import CreateEstimation from "./pages/CreateEstimation";
import EstimationResult from "./pages/EstimationResult";
import EstimationHistory from './pages/EstimationHistory';

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClients from './pages/admin/AdminClients';
import AdminEstimations from './pages/admin/AdminEstimations';
import AdminFeatures from "./pages/admin/AdminFeatures";
import AdminProjectTypes from "./pages/admin/AdminProjectTypes";
import AdminTechStacks from "./pages/admin/AdminTechStacks";
import AdminRoute from './routes/AdminRoute';

export const getEstimation = (id) =>
  API.get(`/estimations/${id}`);

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/features" element={<AdminFeatures />} />
          <Route path="/admin/project-types" element={<AdminProjectTypes />} />
          <Route path="/admin/tech-stacks" element={<AdminTechStacks />} />

          <Route path="/admin/clients" element={<AdminRoute><AdminClients /></AdminRoute>} />
          <Route path="/admin/estimations" element={<AdminRoute><AdminEstimations /></AdminRoute>} />

          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/create-estimation" element={<CreateEstimation />} />
          <Route path="/estimations" element={<EstimationHistory />} />
          <Route path="/estimations/:id" element={<EstimationResult />}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
