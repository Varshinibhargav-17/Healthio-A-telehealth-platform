import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Patient from './pages/Patient'; 
import Provider from './pages/Provider';
import PatientDashboard from './pages/PatientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';




const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/patient" element={<Patient />} /> 
          <Route path="/provider" element={<Provider />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />


        </Routes>
      </div>
    </Router>
  );
};

export default App;
