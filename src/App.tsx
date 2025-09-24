import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import LandingClinicas from './pages/landingClinicas/landingClinicas';
import RegisterPatients from './pages/register/registerPatients';



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/landing-clinicas" element={<LandingClinicas />} />
        {/* Ruta dinámica con parámetro clinicId */}
        <Route path="/register-patients/:clinicId" element={<RegisterPatients />} />
        {/* Ruta de fallback para /register-patients sin parámetro */}
        <Route path="/register-patients" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;