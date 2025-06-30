import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ApodPage from './pages/ApodPage';
import PlanetDetails from './pages/PlanetDetails'; 
import NeoPage from './pages/NeoPage';
import MarsRoverPage from './pages/MarsRoverPage';
import EpicPage from './pages/EpicPage';
import Sidebar from './pages/Sidebar';




function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apod" element={<ApodPage />} />
        <Route path="/planet-details" element={<PlanetDetails />} />
        <Route path="/neo" element={<NeoPage />} />
        <Route path="/mars-rover" element={<MarsRoverPage />} />
        <Route path="/epic" element={<EpicPage />} />

      </Routes>
    </Router>
  );
}

export default App;