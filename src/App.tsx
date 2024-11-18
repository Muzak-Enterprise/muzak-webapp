import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Bars from "./pages/Bars";
import Reservations from "./pages/Reservations";
import LoginRegister from "./pages/LoginRegister";

const App: React.FC = () => {
  const location = useLocation(); // Utilisation de useLocation ici

  // Ne pas afficher la Navbar si la route est "/login"
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      {showNavbar && <Navbar />}{" "}
      {/* Affiche la Navbar sauf sur la page de connexion */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/bars" element={<Bars />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </>
  );
};

export default App;
