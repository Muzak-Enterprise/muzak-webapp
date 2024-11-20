import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import GroupsList from "./components/GroupsList";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";
import Reservations from "./pages/Reservations";
import LoginRegister from "./pages/LoginRegister";
import EasterEgg from "./EasterEgg";

const App: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      <EasterEgg />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginRegister />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <PrivateRoute>
              <GroupsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <PrivateRoute>
              <Groups />
            </PrivateRoute>
          }
        />
         <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <PrivateRoute>
              <Reservations />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
