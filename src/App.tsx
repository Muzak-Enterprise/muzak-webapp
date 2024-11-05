import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Artists from './pages/Artists';
import Bars from './pages/Bars';
import Reservations from './pages/Reservations';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/bars" element={<Bars />} />
        <Route path="/reservations" element={<Reservations />} />
      </Routes>
    </Router>
  );
};

export default App;