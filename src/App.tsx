import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ArtistList from "./components/ArtistList";
import Artists from "./pages/Artists";
import Bars from "./pages/Bars";
import Reservations from "./pages/Reservations";
import LoginRegister from "./pages/LoginRegister";

const App: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      {showNavbar && <Navbar />}{" "}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<ArtistList />} />
        <Route path="/artists/:id" element={<Artists />} />
        <Route path="/bars" element={<Bars />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </>
  );
};

export default App;
