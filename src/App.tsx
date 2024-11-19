import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GroupsList from "./components/GroupsList";
import Groups from "./pages/Groups";
// import Bars from "./pages/Bars";
import Reservations from "./pages/Reservations";
import LoginRegister from "./pages/LoginRegister";
import EasterEgg from "./EasterEgg";

const App: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      <EasterEgg />
      {showNavbar && <Navbar />}{" "}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/groups" element={<GroupsList />} />
        <Route path="/groups/:id" element={<Groups />} />
        {/* <Route path="/bars" element={<Bars />} /> */}
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </>
  );
};

export default App;
