import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Adress from "./pages/Address";
import GroupsList from "./components/GroupsList";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";
import Reservations from "./pages/Reservations";
import LoginRegister from "./pages/LoginRegister";
import EasterEgg from "./EasterEgg";
import NotFound from "./pages/NotFound"; // Page d'erreur 404

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
        <Route
          path="/address"
          element={
            <PrivateRoute>
              <Adress />
            </PrivateRoute>
          }
        />
        
        {/* Route catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;