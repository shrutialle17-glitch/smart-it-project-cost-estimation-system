import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ClientDashboard from './pages/ClientDashboard';
import CreateEstimation from './pages/CreateEstimation';
//import EstimationResult from './pages/EstimationResult';

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route
            path="/create-estimation"
            element={<CreateEstimation />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;